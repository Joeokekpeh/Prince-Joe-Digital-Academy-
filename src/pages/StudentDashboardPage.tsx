import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Circle, Edit3, LogOut } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Course } from '../types/academy';

interface StudentDashboardPageProps {
  onSelectCourse: (course: Course) => void;
}

export function StudentDashboardPage({ onSelectCourse }: StudentDashboardPageProps) {
  const {
    activeUser,
    authReady,
    courses,
    enrollments,
    toggleLessonCompletion,
    completeCourseEnrollment,
    getCourseProgressPercent,
    enrollInCourse,
    updateOwnProfile,
    navigate,
    openAuthModal,
    signOut,
  } = useAcademy();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTrack, setEditTrack] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const userEnrollments = useMemo(() => {
    if (!activeUser) return [];
    return enrollments.filter((e) => e.userId === activeUser.id);
  }, [activeUser, enrollments]);

  const enrolledCoursePairs = useMemo(() => {
    return userEnrollments
      .map((enrollment) => {
        const course = courses.find((c) => c.id === enrollment.courseId);
        if (!course) return null;
        return { enrollment, course, progress: getCourseProgressPercent(course, enrollment) };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [userEnrollments, courses, getCourseProgressPercent]);

  const availableCourses = useMemo(() => {
    const enrolledIds = new Set(userEnrollments.map((e) => e.courseId));
    return courses.filter((c) => !enrolledIds.has(c.id));
  }, [courses, userEnrollments]);

  const overallAverage = useMemo(() => {
    if (enrolledCoursePairs.length === 0) return 0;
    const sum = enrolledCoursePairs.reduce((acc, item) => acc + item.progress, 0);
    return Math.round(sum / enrolledCoursePairs.length);
  }, [enrolledCoursePairs]);

  if (!authReady) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-slate-600">
        Verifying Firebase Authentication session...
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-navy-900">Student Dashboard</h1>
        <p className="text-base text-slate-600">
          Sign in with your Google Account to save your student profile, enroll in courses, and
          sync lesson progress securely in Cloud Firestore.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg cursor-pointer"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="px-5 py-2.5 bg-white border border-slate-300 text-navy-900 text-sm font-semibold rounded-lg cursor-pointer"
          >
            Choose Track &amp; Register
          </button>
        </div>
      </div>
    );
  }

  const startProfileEdit = () => {
    setEditName(activeUser.displayName);
    setEditTrack(activeUser.trackInterest);
    setProfileMessage(null);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim().length < 2) return;
    try {
      await updateOwnProfile(editName, editTrack);
      setIsEditingProfile(false);
      setProfileMessage('Profile updated in Cloud Firestore.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to update profile.');
    }
  };

  const handleEnroll = async (courseId: string) => {
    setActionError(null);
    const result = await enrollInCourse(courseId);
    if (!result.ok) {
      setActionError(result.message);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[75vh] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Workspace Header */}
        <div className="bg-navy-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-gold-400 mb-1">
              STUDENT PORTAL &middot; CLOUD FIRESTORE SYNCED
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Welcome, {activeUser.displayName}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Focus Track: {activeUser.trackInterest} &middot; {activeUser.joinedLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startProfileEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-gold-400 border border-gold-500/40 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => navigate('courses')}
              className="px-4 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Courses
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-navy-950 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {isEditingProfile && (
          <form
            onSubmit={(e) => void handleSaveProfile(e)}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 max-w-2xl"
          >
            <h2 className="font-display text-lg font-bold text-navy-900">
              Update Your Student Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Primary Track
                </label>
                <select
                  value={editTrack}
                  onChange={(e) => setEditTrack(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Artificial Intelligence & Prompting">
                    Artificial Intelligence &amp; Prompting
                  </option>
                  <option value="Website & App Development">Website &amp; App Development</option>
                  <option value="Digital Business Opportunities">
                    Digital Business Opportunities
                  </option>
                  <option value="Essential Digital Foundations">
                    Essential Digital Foundations
                  </option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-royal-600 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {profileMessage && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900">
            {profileMessage}
          </div>
        )}

        {actionError && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800">
            {actionError}
          </div>
        )}

        {/* Clean Tabular Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Enrolled Courses</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-navy-900 mt-1">
              {enrolledCoursePairs.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Average Completion</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-royal-600 mt-1">
              {overallAverage}%
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Database Security</p>
            <p className="text-sm font-semibold text-emerald-700 mt-2">
              Private Records Protected (Google Auth)
            </p>
          </div>
        </div>

        {/* Active Enrolled Courses with Interactive Lesson Progress */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-navy-900">
            My Enrolled Courses &amp; Progress
          </h2>

          {enrolledCoursePairs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-royal-600 mx-auto" />
              <h3 className="font-display text-lg font-bold text-navy-900">
                You have not enrolled in any courses yet
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Pick a course below or browse the catalog to start checking off modules and saving
                your progress to Cloud Firestore.
              </p>
              <button
                type="button"
                onClick={() => navigate('courses')}
                className="px-5 py-2.5 bg-royal-600 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCoursePairs.map(({ course, enrollment, progress }) => {
                const isCompleted = enrollment.status === 'completed';
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          <span className="text-royal-600 font-semibold">{course.category}</span>
                          <span className="mx-2" aria-hidden="true">
                            &middot;
                          </span>
                          <span>Enrolled {enrollment.enrolledDate}</span>
                          {isCompleted && (
                            <>
                              <span className="mx-2" aria-hidden="true">
                                &middot;
                              </span>
                              <span className="text-emerald-700 font-semibold">Completed</span>
                            </>
                          )}
                        </p>
                        <h3 className="font-display text-xl font-bold text-navy-900 mt-1">
                          {course.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="font-mono tabular-nums text-lg font-bold text-navy-900">
                            {progress}%
                          </p>
                          <p className="text-xs text-slate-500">Completed</p>
                        </div>
                        {progress === 100 && !isCompleted && (
                          <button
                            type="button"
                            onClick={() => void completeCourseEnrollment(enrollment.id)}
                            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap"
                          >
                            Finalize Completion
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectCourse(course)}
                          className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-navy-900 rounded-lg cursor-pointer whitespace-nowrap"
                        >
                          Syllabus Details
                        </button>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-royal-600 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">
                        {isCompleted
                          ? 'COURSE COMPLETED & LOCKED'
                          : 'CLICK ANY MODULE TO UPDATE YOUR CLOUD PROGRESS'}
                      </p>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                        {course.lessons.map((lesson) => {
                          const completed = enrollment.completedLessonIds.includes(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              disabled={isCompleted}
                              onClick={() => void toggleLessonCompletion(course.id, lesson.id)}
                              className="w-full p-3.5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-default disabled:hover:bg-white"
                            >
                              <div className="flex items-start gap-3">
                                {completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p
                                    className={`text-sm font-medium ${
                                      completed ? 'text-slate-500 line-through' : 'text-navy-900'
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-slate-500">{lesson.summary}</p>
                                </div>
                              </div>
                              <span className="font-mono tabular-nums text-xs text-slate-500 shrink-0">
                                {lesson.durationMinutes} min
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Courses to Enroll */}
        {availableCourses.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="font-display text-xl font-bold text-navy-900">
              Available Courses to Enroll
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-medium text-royal-600 mb-1">
                      {course.category} &middot; {course.level}
                    </p>
                    <h3 className="font-display text-base font-bold text-navy-900">
                      {course.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleEnroll(course.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 cursor-pointer self-start"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
