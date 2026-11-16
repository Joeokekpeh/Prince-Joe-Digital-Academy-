import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ACADEMY_IMAGES, DEFAULT_SITE_CONTENT, SAMPLE_COURSES, SAMPLE_NEWS } from '../data/sampleData';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import {
  AcademyUser,
  ContactInquiry,
  Course,
  CourseCategory,
  CourseEnrollment,
  CourseLevel,
  NewsArticle,
  SiteContentConfig,
  UserRole,
} from '../types/academy';

const OWNER_ADMIN_EMAIL = 'joeokekpeh@gmail.com';
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function toSafeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned && SAFE_ID_REGEX.test(cleaned) ? cleaned : `id-${Date.now()}`;
}

function clampString(value: string, maxLen: number): string {
  return value.trim().slice(0, maxLen);
}

export async function signInWithGoogleAcademy(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutAcademy(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function checkIsAdminUser(firebaseUser: User): Promise<boolean> {
  if (!firebaseUser.emailVerified) return false;
  if (firebaseUser.email?.toLowerCase() === OWNER_ADMIN_EMAIL) {
    return true;
  }
  const adminPath = `admins/${firebaseUser.uid}`;
  try {
    const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
    return adminSnap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, adminPath);
  }
}

export async function ensureUserProfileInFirestore(
  firebaseUser: User,
  preferredTrack?: string
): Promise<AcademyUser> {
  const uid = toSafeId(firebaseUser.uid);
  const userPath = `users/${uid}`;
  const privatePath = `users/${uid}/private/info`;
  const isOwnerEmail =
    Boolean(firebaseUser.emailVerified) &&
    firebaseUser.email?.toLowerCase() === OWNER_ADMIN_EMAIL;

  let isAdmin = isOwnerEmail;
  if (!isAdmin) {
    try {
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      isAdmin = adminSnap.exists();
    } catch {
      isAdmin = false;
    }
  }

  // Ensure owner admin record exists when the verified owner signs in
  if (isOwnerEmail) {
    const adminDocPath = `admins/${uid}`;
    try {
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      if (!adminSnap.exists()) {
        await setDoc(doc(db, 'admins', uid), {
          uid,
          email: clampString(firebaseUser.email || OWNER_ADMIN_EMAIL, 200),
          grantedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, adminDocPath);
    }
  }

  let existingUserSnap;
  try {
    existingUserSnap = await getDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  const displayName = clampString(
    firebaseUser.displayName || (isAdmin ? 'Prince Joe (Admin)' : 'Academy Student'),
    100
  );
  const emailHandle = clampString((firebaseUser.email || 'student').split('@')[0] || 'student', 60);

  if (!existingUserSnap.exists()) {
    const role: UserRole = isAdmin ? 'admin' : 'student';
    const trackInterest = clampString(
      preferredTrack || (isAdmin ? 'Academy Operations & Curriculum' : 'AI & Web Development'),
      120
    );
    const joinedLabel = isAdmin ? 'Academy Administrator' : 'Joined Nov 2026';

    try {
      await setDoc(doc(db, 'users', uid), {
        uid,
        displayName,
        trackInterest,
        role,
        joinedLabel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }

    if (firebaseUser.email) {
      try {
        await setDoc(doc(db, 'users', uid, 'private', 'info'), {
          uid,
          email: clampString(firebaseUser.email, 200),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, privatePath);
      }
    }

    return {
      id: uid,
      uid,
      displayName,
      handle: emailHandle,
      email: firebaseUser.email || undefined,
      role,
      joinedLabel,
      trackInterest,
    };
  }

  const data = existingUserSnap.data();
  const effectiveRole: UserRole = isAdmin ? 'admin' : (data.role as UserRole) || 'student';

  // Keep isolated private PII document up to date
  if (firebaseUser.email) {
    try {
      const privSnap = await getDoc(doc(db, 'users', uid, 'private', 'info'));
      if (!privSnap.exists()) {
        await setDoc(doc(db, 'users', uid, 'private', 'info'), {
          uid,
          email: clampString(firebaseUser.email, 200),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, privatePath);
    }
  }

  return {
    id: uid,
    uid,
    displayName: String(data.displayName || displayName),
    handle: emailHandle,
    email: firebaseUser.email || undefined,
    role: effectiveRole,
    joinedLabel: String(data.joinedLabel || 'Academy Member'),
    trackInterest: String(data.trackInterest || 'AI & Web Development'),
  };
}

export async function updateOwnStudentProfile(
  uid: string,
  displayName: string,
  trackInterest: string
): Promise<void> {
  const safeUid = toSafeId(uid);
  const path = `users/${safeUid}`;
  try {
    await updateDoc(doc(db, 'users', safeUid), {
      displayName: clampString(displayName, 100),
      trackInterest: clampString(trackInterest, 120),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribePublicCourses(onData: (courses: Course[], hasRemoteDocs: boolean) => void) {
  const path = 'courses';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(SAMPLE_COURSES, false);
        return;
      }
      const list: Course[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          title: String(data.title || ''),
          category: data.category as CourseCategory,
          level: data.level as CourseLevel,
          durationWeeks: Number(data.durationWeeks || 4),
          lessonsCount: Number(data.lessonsCount || (Array.isArray(data.lessons) ? data.lessons.length : 0)),
          featured: Boolean(data.featured),
          imageUrl: String(data.imageUrl || ACADEMY_IMAGES.aiTrack),
          shortDescription: String(data.shortDescription || ''),
          tuitionLabel: String(data.tuitionLabel || 'Sample Curriculum'),
          outcomes: Array.isArray(data.outcomes) ? data.outcomes.map(String) : [],
          lessons: Array.isArray(data.lessons) ? data.lessons : [],
        };
      });
      onData(list, true);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribePublicNews(onData: (articles: NewsArticle[]) => void) {
  const path = 'news';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(SAMPLE_NEWS);
        return;
      }
      const list: NewsArticle[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          title: String(data.title || ''),
          category: data.category as NewsArticle['category'],
          publishedDate: String(data.publishedDate || ''),
          readTimeMinutes: Number(data.readTimeMinutes || 3),
          author: String(data.author || 'PRINCE JOE Editorial Desk'),
          imageUrl: String(data.imageUrl || ACADEMY_IMAGES.aiTrack),
          excerpt: String(data.excerpt || ''),
          body: Array.isArray(data.body) ? data.body.map(String) : [],
        };
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeSiteContent(onData: (content: SiteContentConfig) => void) {
  const path = 'siteContent/main';
  return onSnapshot(
    doc(db, 'siteContent', 'main'),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(DEFAULT_SITE_CONTENT);
        return;
      }
      const data = snapshot.data();
      onData({
        academyName: String(data.academyName || DEFAULT_SITE_CONTENT.academyName),
        heroHeadline: String(data.heroHeadline || DEFAULT_SITE_CONTENT.heroHeadline),
        heroSubheadline: String(data.heroSubheadline || DEFAULT_SITE_CONTENT.heroSubheadline),
        aboutMission: String(data.aboutMission || DEFAULT_SITE_CONTENT.aboutMission),
        announcementLine: String(data.announcementLine || DEFAULT_SITE_CONTENT.announcementLine),
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeUserEnrollments(
  uid: string,
  isAdmin: boolean,
  onData: (enrollments: CourseEnrollment[]) => void
) {
  const path = 'enrollments';
  const ref = isAdmin
    ? collection(db, path)
    : query(collection(db, path), where('userId', '==', toSafeId(uid)));

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: CourseEnrollment[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          userId: String(data.userId || ''),
          courseId: String(data.courseId || ''),
          enrolledDate: String(data.enrolledDate || ''),
          completedLessonIds: Array.isArray(data.completedLessonIds)
            ? data.completedLessonIds.map(String)
            : [],
          status: (data.status as 'active' | 'completed') || 'active',
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeAdminUsersList(onData: (users: AcademyUser[]) => void) {
  const path = 'users';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: AcademyUser[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.uid || d.id),
          uid: String(data.uid || d.id),
          displayName: String(data.displayName || 'Student'),
          handle: String(data.uid || d.id).slice(0, 12),
          role: (data.role as UserRole) || 'student',
          joinedLabel: String(data.joinedLabel || ''),
          trackInterest: String(data.trackInterest || ''),
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeUserInquiries(
  uid: string,
  isAdmin: boolean,
  onData: (inquiries: ContactInquiry[]) => void
) {
  const path = 'inquiries';
  const ref = isAdmin
    ? collection(db, path)
    : query(collection(db, path), where('userId', '==', toSafeId(uid)));

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: ContactInquiry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          userId: String(data.userId || ''),
          senderAlias: String(data.senderAlias || ''),
          topic: String(data.topic || ''),
          message: String(data.message || ''),
          submittedAt: 'Saved in Cloud Firestore',
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function seedCatalogToFirestore(): Promise<void> {
  // Seed Courses
  for (const course of SAMPLE_COURSES) {
    const courseId = toSafeId(course.id);
    const path = `courses/${courseId}`;
    try {
      const snap = await getDoc(doc(db, 'courses', courseId));
      if (!snap.exists()) {
        await setDoc(doc(db, 'courses', courseId), {
          id: courseId,
          title: clampString(course.title, 160),
          category: course.category,
          level: course.level,
          durationWeeks: course.durationWeeks,
          lessonsCount: course.lessons.length,
          featured: course.featured,
          imageUrl: clampString(course.imageUrl, 400),
          shortDescription: clampString(course.shortDescription, 800),
          tuitionLabel: clampString(course.tuitionLabel, 80),
          outcomes: course.outcomes.slice(0, 20),
          lessons: course.lessons.slice(0, 50),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  // Seed News
  for (const article of SAMPLE_NEWS) {
    const articleId = toSafeId(article.id);
    const path = `news/${articleId}`;
    try {
      const snap = await getDoc(doc(db, 'news', articleId));
      if (!snap.exists()) {
        await setDoc(doc(db, 'news', articleId), {
          id: articleId,
          title: clampString(article.title, 200),
          category: article.category,
          publishedDate: clampString(article.publishedDate, 60),
          readTimeMinutes: article.readTimeMinutes,
          author: clampString(article.author, 100),
          imageUrl: clampString(article.imageUrl, 400),
          excerpt: clampString(article.excerpt, 500),
          body: article.body.slice(0, 40),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  // Seed Site Content
  const contentPath = 'siteContent/main';
  try {
    const contentSnap = await getDoc(doc(db, 'siteContent', 'main'));
    if (!contentSnap.exists()) {
      await setDoc(doc(db, 'siteContent', 'main'), {
        academyName: clampString(DEFAULT_SITE_CONTENT.academyName, 120),
        heroHeadline: clampString(DEFAULT_SITE_CONTENT.heroHeadline, 220),
        heroSubheadline: clampString(DEFAULT_SITE_CONTENT.heroSubheadline, 600),
        aboutMission: clampString(DEFAULT_SITE_CONTENT.aboutMission, 800),
        announcementLine: clampString(DEFAULT_SITE_CONTENT.announcementLine, 300),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, contentPath);
  }
}

export async function enrollInCourseFirestore(uid: string, courseId: string): Promise<void> {
  const safeUid = toSafeId(uid);
  const safeCourseId = toSafeId(courseId);
  const enrollmentId = toSafeId(`enr_${safeUid.slice(0, 24)}_${safeCourseId.slice(0, 48)}`);
  const path = `enrollments/${enrollmentId}`;

  // Ensure the course exists in Firestore (security rules enforce exists(/courses/courseId))
  try {
    const courseSnap = await getDoc(doc(db, 'courses', safeCourseId));
    if (!courseSnap.exists()) {
      throw new Error(
        'This sample course has not been published to Cloud Firestore yet. Sign in as the Academy Admin first to publish the initial catalog.'
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('not been published')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.GET, `courses/${safeCourseId}`);
  }

  try {
    await setDoc(doc(db, 'enrollments', enrollmentId), {
      id: enrollmentId,
      userId: safeUid,
      courseId: safeCourseId,
      enrolledDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      completedLessonIds: [],
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function toggleLessonFirestore(
  enrollment: CourseEnrollment,
  lessonId: string
): Promise<void> {
  const enrollmentId = toSafeId(enrollment.id);
  const path = `enrollments/${enrollmentId}`;
  const exists = enrollment.completedLessonIds.includes(lessonId);
  const updatedIds = exists
    ? enrollment.completedLessonIds.filter((id) => id !== lessonId)
    : [...enrollment.completedLessonIds, lessonId];

  try {
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      completedLessonIds: updatedIds.slice(0, 50),
      status: enrollment.status || 'active',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markEnrollmentCompletedFirestore(enrollmentId: string): Promise<void> {
  const safeId = toSafeId(enrollmentId);
  const path = `enrollments/${safeId}`;
  try {
    await updateDoc(doc(db, 'enrollments', safeId), {
      status: 'completed',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function createCourseFirestore(input: {
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  durationWeeks: number;
  shortDescription: string;
}): Promise<void> {
  const categoryImageMap: Record<CourseCategory, string> = {
    'Artificial Intelligence': ACADEMY_IMAGES.aiTrack,
    'Website & App Development': ACADEMY_IMAGES.webAppTrack,
    'Digital Business': ACADEMY_IMAGES.digitalBusiness,
    'Digital Foundations': ACADEMY_IMAGES.mentorship,
  };

  const courseId = toSafeId(`course-${Date.now()}`);
  const path = `courses/${courseId}`;

  try {
    await setDoc(doc(db, 'courses', courseId), {
      id: courseId,
      title: clampString(input.title, 160),
      category: input.category,
      level: input.level,
      durationWeeks: Math.max(1, Math.min(104, Number(input.durationWeeks) || 4)),
      lessonsCount: 3,
      featured: false,
      imageUrl: categoryImageMap[input.category],
      shortDescription: clampString(input.shortDescription, 800),
      tuitionLabel: 'Sample Curriculum',
      outcomes: [
        'Build practical project-based confidence step by step',
        'Practice modern workflows aligned with international standards',
        'Complete a documented capstone review',
      ],
      lessons: [
        {
          id: `${courseId}-l1`,
          title: '01. Core Foundations & Setup',
          durationMinutes: 30,
          summary: 'Essential principles and clean workspace configuration.',
        },
        {
          id: `${courseId}-l2`,
          title: '02. Guided Practical Implementation',
          durationMinutes: 45,
          summary: 'Hands-on building block exercises with real examples.',
        },
        {
          id: `${courseId}-l3`,
          title: '03. Final Review & Next Steps',
          durationMinutes: 40,
          summary: 'Assemble and verify your finished milestone.',
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCourseFirestore(
  courseId: string,
  updates: Partial<Pick<Course, 'title' | 'level' | 'durationWeeks' | 'featured'>>
): Promise<void> {
  const safeId = toSafeId(courseId);
  const path = `courses/${safeId}`;
  const cleanUpdates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (typeof updates.title === 'string') cleanUpdates.title = clampString(updates.title, 160);
  if (updates.level) cleanUpdates.level = updates.level;
  if (typeof updates.durationWeeks === 'number') {
    cleanUpdates.durationWeeks = Math.max(1, Math.min(104, updates.durationWeeks));
  }
  if (typeof updates.featured === 'boolean') cleanUpdates.featured = updates.featured;

  try {
    await updateDoc(doc(db, 'courses', safeId), cleanUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCourseFirestore(courseId: string): Promise<void> {
  const safeId = toSafeId(courseId);
  const path = `courses/${safeId}`;
  try {
    await deleteDoc(doc(db, 'courses', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateSiteContentFirestore(
  updates: SiteContentConfig
): Promise<void> {
  const path = 'siteContent/main';
  try {
    await setDoc(doc(db, 'siteContent', 'main'), {
      academyName: clampString(updates.academyName, 120),
      heroHeadline: clampString(updates.heroHeadline, 220),
      heroSubheadline: clampString(updates.heroSubheadline, 600),
      aboutMission: clampString(updates.aboutMission, 800),
      announcementLine: clampString(updates.announcementLine, 300),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function submitInquiryFirestore(
  uid: string,
  senderAlias: string,
  topic: string,
  message: string
): Promise<void> {
  const safeUid = toSafeId(uid);
  const inquiryId = toSafeId(`inq-${Date.now()}`);
  const path = `inquiries/${inquiryId}`;

  try {
    await setDoc(doc(db, 'inquiries', inquiryId), {
      id: inquiryId,
      userId: safeUid,
      senderAlias: clampString(senderAlias, 100),
      topic: clampString(topic, 120),
      message: clampString(message, 2000),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function checkCatalogExistsInFirestore(): Promise<boolean> {
  const path = 'courses';
  try {
    const snap = await getDocs(collection(db, path));
    return !snap.empty;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
