import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { Course } from '../../types/academy';
import { MediaFrame } from '../common/MediaFrame';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
}

export function CourseCard({ course, onSelectCourse }: CourseCardProps) {
  const { getCourseEnrollment, getCourseProgressPercent } = useAcademy();
  const enrollment = getCourseEnrollment(course.id);
  const progress = getCourseProgressPercent(course, enrollment);

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-royal-600/50 transition-colors">
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100">
        <MediaFrame
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          fallbackTitle={course.title}
        />
      </div>

      <div className="flex flex-col flex-1 p-6">
        {/* Zero-Pill Metadata Discipline: Clean unboxed text with middot separators */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500 mb-3">
          <span className="text-royal-600 font-semibold">{course.category}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{course.level}</span>
          <span aria-hidden="true">&middot;</span>
          <span className="font-mono tabular-nums">{course.durationWeeks} Weeks</span>
        </div>

        <h3 className="font-display text-lg font-bold text-navy-900 leading-snug mb-2.5 text-balance">
          {course.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
          {course.shortDescription}
        </p>

        {enrollment && (
          <div className="mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Enrolled
              </span>
              <span className="font-mono tabular-nums text-navy-900">{progress}% complete</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-royal-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {course.lessons.length} Modules
          </span>
          <button
            type="button"
            onClick={() => onSelectCourse(course)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {enrollment ? 'Continue Course' : 'View Syllabus'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
