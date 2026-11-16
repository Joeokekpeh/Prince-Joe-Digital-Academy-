import { CheckCircle2, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course } from '../../types/academy';
import { MediaFrame } from '../common/MediaFrame';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  const {
    activeUser,
    enrollInCourse,
    getCourseEnrollment,
    getCourseProgressPercent,
    navigate,
    openAuthModal,
  } = useAcademy();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  if (!course) return null;

  const enrollment = getCourseEnrollment(course.id);
  const progress = getCourseProgressPercent(course, enrollment);

  const handleEnrollClick = async () => {
    if (!activeUser) {
      onClose();
      openAuthModal('register');
      return;
    }
    setEnrolling(true);
    try {
      const result = await enrollInCourse(course.id);
      setStatusMessage(result.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-500">
            <span className="text-royal-600 font-semibold">{course.category}</span>
            <span className="mx-2" aria-hidden="true">
              &middot;
            </span>
            <span>{course.level}</span>
            <span className="mx-2" aria-hidden="true">
              &middot;
            </span>
            <span className="font-mono tabular-nums">{course.durationWeeks} Weeks</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close syllabus"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
            <div className="md:col-span-2 aspect-[4/3] md:aspect-auto rounded-lg overflow-hidden border border-slate-200">
              <MediaFrame
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full"
                fallbackTitle={course.title}
              />
            </div>
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <h2
                  id="course-modal-title"
                  className="font-display text-2xl font-bold text-navy-900 leading-tight mb-3"
                >
                  {course.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {course.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-navy-900">{course.tuitionLabel}</span>
                  <span className="mx-2" aria-hidden="true">
                    &middot;
                  </span>
                  <span>No real payment required in prototype</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-navy-900 mb-3">
              What You Will Learn
            </h3>
            <ul className="space-y-2.5">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-navy-900">
                Course Syllabus Modules
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {course.lessons.length} Lessons
              </span>
            </div>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {course.lessons.map((lesson) => {
                const isDone = enrollment?.completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{lesson.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{lesson.summary}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.durationMinutes} min
                      </span>
                      {isDone && <span className="text-emerald-700 font-sans font-semibold">Done</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-navy-900 flex items-center justify-between gap-4">
              <span>{statusMessage}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('student-dashboard');
                }}
                className="text-sm font-semibold text-royal-600 hover:underline whitespace-nowrap cursor-pointer"
              >
                Open Student Dashboard
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {enrollment ? (
              <div className="flex items-center justify-between w-full gap-4">
                <p className="text-sm text-slate-700">
                  Enrolled &middot;{' '}
                  <span className="font-mono tabular-nums font-semibold text-navy-900">
                    {progress}% complete
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('student-dashboard');
                  }}
                  className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open in Student Dashboard
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end w-full gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={enrolling}
                  onClick={() => void handleEnrollClick()}
                  className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {enrolling
                    ? 'Enrolling...'
                    : activeUser
                      ? 'Enroll in Course'
                      : 'Sign in to Enroll'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
