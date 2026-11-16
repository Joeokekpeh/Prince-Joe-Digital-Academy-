import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SITE_CONTENT, SAMPLE_COURSES, SAMPLE_NEWS } from '../data/sampleData';
import { auth } from '../firebase';
import {
  createCourseFirestore,
  deleteCourseFirestore,
  enrollInCourseFirestore,
  ensureUserProfileInFirestore,
  markEnrollmentCompletedFirestore,
  seedCatalogToFirestore,
  signInWithGoogleAcademy,
  signOutAcademy,
  submitInquiryFirestore,
  subscribeAdminUsersList,
  subscribePublicCourses,
  subscribePublicNews,
  subscribeSiteContent,
  subscribeUserEnrollments,
  subscribeUserInquiries,
  toggleLessonFirestore,
  updateCourseFirestore,
  updateOwnStudentProfile,
  updateSiteContentFirestore,
} from '../services/firestoreService';
import {
  AcademyUser,
  ContactInquiry,
  Course,
  CourseCategory,
  CourseEnrollment,
  CourseLevel,
  NewsArticle,
  PageId,
  SiteContentConfig,
} from '../types/academy';

interface NewCourseInput {
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  durationWeeks: number;
  shortDescription: string;
}

interface AcademyContextValue {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register' | 'admin';
  openAuthModal: (tab?: 'login' | 'register' | 'admin') => void;
  closeAuthModal: () => void;

  authReady: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  hasRemoteCatalog: boolean;

  courses: Course[];
  news: NewsArticle[];
  users: AcademyUser[];
  enrollments: CourseEnrollment[];
  siteContent: SiteContentConfig;
  inquiries: ContactInquiry[];
  activeUser: AcademyUser | null;

  signInWithGoogle: (preferredTrack?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateOwnProfile: (displayName: string, trackInterest: string) => Promise<void>;

  enrollInCourse: (courseId: string) => Promise<{ ok: boolean; message: string }>;
  toggleLessonCompletion: (courseId: string, lessonId: string) => Promise<void>;
  completeCourseEnrollment: (enrollmentId: string) => Promise<void>;
  getCourseEnrollment: (courseId: string) => CourseEnrollment | undefined;
  getCourseProgressPercent: (course: Course, enrollment?: CourseEnrollment) => number;

  seedCatalogNow: () => Promise<void>;
  addCourseAdmin: (input: NewCourseInput) => Promise<void>;
  updateCourseAdmin: (
    courseId: string,
    updates: Partial<Pick<Course, 'title' | 'level' | 'durationWeeks' | 'featured'>>
  ) => Promise<void>;
  deleteCourseAdmin: (courseId: string) => Promise<void>;
  updateSiteContentAdmin: (updates: Partial<SiteContentConfig>) => Promise<void>;
  submitContactInquiry: (senderAlias: string, topic: string, message: string) => Promise<void>;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export function AcademyProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'admin'>(
    'login'
  );

  const [authReady, setAuthReady] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasRemoteCatalog, setHasRemoteCatalog] = useState(false);

  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [news, setNews] = useState<NewsArticle[]>(SAMPLE_NEWS);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);

  const [activeUser, setActiveUser] = useState<AcademyUser | null>(null);
  const [users, setUsers] = useState<AcademyUser[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  const pendingTrackRef = useRef<string | undefined>(undefined);

  // Public Firestore catalog listeners
  useEffect(() => {
    const unsubCourses = subscribePublicCourses((remoteCourses, hasDocs) => {
      setCourses(remoteCourses);
      setHasRemoteCatalog(hasDocs);
    });
    const unsubNews = subscribePublicNews((remoteNews) => {
      setNews(remoteNews);
    });
    const unsubContent = subscribeSiteContent((remoteContent) => {
      setSiteContent(remoteContent);
    });

    return () => {
      unsubCourses();
      unsubNews();
      unsubContent();
    };
  }, []);

  // Auth state + user-scoped Firestore listeners
  useEffect(() => {
    let unsubEnrollments: (() => void) | null = null;
    let unsubUsers: (() => void) | null = null;
    let unsubInquiries: (() => void) | null = null;

    const cleanupPrivateListeners = () => {
      if (unsubEnrollments) {
        unsubEnrollments();
        unsubEnrollments = null;
      }
      if (unsubUsers) {
        unsubUsers();
        unsubUsers = null;
      }
      if (unsubInquiries) {
        unsubInquiries();
        unsubInquiries = null;
      }
    };

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      cleanupPrivateListeners();

      if (!firebaseUser) {
        setActiveUser(null);
        setUsers([]);
        setEnrollments([]);
        setInquiries([]);
        setAuthReady(true);
        return;
      }

      try {
        const profile = await ensureUserProfileInFirestore(firebaseUser, pendingTrackRef.current);
        pendingTrackRef.current = undefined;
        setActiveUser(profile);
        setAuthError(null);

        const isAdmin = profile.role === 'admin';
        unsubEnrollments = subscribeUserEnrollments(profile.id, isAdmin, setEnrollments);
        unsubInquiries = subscribeUserInquiries(profile.id, isAdmin, setInquiries);

        if (isAdmin) {
          unsubUsers = subscribeAdminUsersList(setUsers);
          // Automatically seed initial catalog on first admin sign-in if empty
          await seedCatalogToFirestore();
        } else {
          setUsers([profile]);
        }
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'Unable to load Firebase profile.');
      } finally {
        setAuthReady(true);
      }
    });

    return () => {
      cleanupPrivateListeners();
      unsubAuth();
    };
  }, []);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openAuthModal = (tab: 'login' | 'register' | 'admin' = 'login') => {
    setAuthModalInitialTab(tab);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const signInWithGoogle = async (preferredTrack?: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    pendingTrackRef.current = preferredTrack;
    try {
      const user = await signInWithGoogleAcademy();
      const profile = await ensureUserProfileInFirestore(user, preferredTrack);
      setActiveUser(profile);
      setIsAuthModalOpen(false);
      navigate(profile.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in popup was closed before completing.');
      } else {
        setAuthError(msg);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOut = async () => {
    await signOutAcademy();
    setActiveUser(null);
    setEnrollments([]);
    setUsers([]);
    setInquiries([]);
    if (currentPage === 'student-dashboard' || currentPage === 'admin-dashboard') {
      navigate('home');
    }
  };

  const updateOwnProfile = async (displayName: string, trackInterest: string) => {
    if (!activeUser) return;
    await updateOwnStudentProfile(activeUser.id, displayName, trackInterest);
    setActiveUser((prev) =>
      prev
        ? {
            ...prev,
            displayName: displayName.trim().slice(0, 100),
            trackInterest: trackInterest.trim().slice(0, 120),
          }
        : null
    );
  };

  const enrollInCourse = async (courseId: string): Promise<{ ok: boolean; message: string }> => {
    if (!activeUser) {
      openAuthModal('register');
      return { ok: false, message: 'Please sign in with Google first to enroll.' };
    }

    const alreadyEnrolled = enrollments.some(
      (e) => e.userId === activeUser.id && e.courseId === courseId
    );
    if (alreadyEnrolled) {
      navigate('student-dashboard');
      return { ok: true, message: 'You are already enrolled in this course.' };
    }

    try {
      await enrollInCourseFirestore(activeUser.id, courseId);
      return { ok: true, message: 'Enrolled and saved to Cloud Firestore.' };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : 'Could not complete enrollment.',
      };
    }
  };

  const toggleLessonCompletion = async (courseId: string, lessonId: string) => {
    if (!activeUser) return;
    const enrollment = enrollments.find(
      (e) => e.userId === activeUser.id && e.courseId === courseId
    );
    if (!enrollment || enrollment.status === 'completed') return;
    await toggleLessonFirestore(enrollment, lessonId);
  };

  const completeCourseEnrollment = async (enrollmentId: string) => {
    await markEnrollmentCompletedFirestore(enrollmentId);
  };

  const getCourseEnrollment = (courseId: string) => {
    if (!activeUser) return undefined;
    return enrollments.find((e) => e.userId === activeUser.id && e.courseId === courseId);
  };

  const getCourseProgressPercent = (course: Course, enrollment?: CourseEnrollment) => {
    if (!enrollment || course.lessons.length === 0) return 0;
    const completed = enrollment.completedLessonIds.filter((id) =>
      course.lessons.some((l) => l.id === id)
    ).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const seedCatalogNow = async () => {
    await seedCatalogToFirestore();
  };

  const addCourseAdmin = async (input: NewCourseInput) => {
    await createCourseFirestore(input);
  };

  const updateCourseAdmin = async (
    courseId: string,
    updates: Partial<Pick<Course, 'title' | 'level' | 'durationWeeks' | 'featured'>>
  ) => {
    await updateCourseFirestore(courseId, updates);
  };

  const deleteCourseAdmin = async (courseId: string) => {
    await deleteCourseFirestore(courseId);
  };

  const updateSiteContentAdmin = async (updates: Partial<SiteContentConfig>) => {
    const merged: SiteContentConfig = { ...siteContent, ...updates };
    await updateSiteContentFirestore(merged);
  };

  const submitContactInquiry = async (senderAlias: string, topic: string, message: string) => {
    if (!activeUser) {
      openAuthModal('login');
      return;
    }
    await submitInquiryFirestore(activeUser.id, senderAlias, topic, message);
  };

  const value = useMemo<AcademyContextValue>(
    () => ({
      currentPage,
      navigate,
      isAuthModalOpen,
      authModalInitialTab,
      openAuthModal,
      closeAuthModal,
      authReady,
      isAuthLoading,
      authError,
      hasRemoteCatalog,
      courses,
      news,
      users,
      enrollments,
      siteContent,
      inquiries,
      activeUser,
      signInWithGoogle,
      signOut,
      updateOwnProfile,
      enrollInCourse,
      toggleLessonCompletion,
      completeCourseEnrollment,
      getCourseEnrollment,
      getCourseProgressPercent,
      seedCatalogNow,
      addCourseAdmin,
      updateCourseAdmin,
      deleteCourseAdmin,
      updateSiteContentAdmin,
      submitContactInquiry,
    }),
    [
      currentPage,
      isAuthModalOpen,
      authModalInitialTab,
      authReady,
      isAuthLoading,
      authError,
      hasRemoteCatalog,
      courses,
      news,
      users,
      enrollments,
      siteContent,
      inquiries,
      activeUser,
    ]
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  const ctx = useContext(AcademyContext);
  if (!ctx) {
    throw new Error('useAcademy must be used inside AcademyProvider');
  }
  return ctx;
}
