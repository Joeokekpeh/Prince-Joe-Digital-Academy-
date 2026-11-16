import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CourseCard } from '../components/courses/CourseCard';
import { useAcademy } from '../context/AcademyContext';
import { Course, CourseCategory } from '../types/academy';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
}

const CATEGORY_TABS: ('All' | CourseCategory)[] = [
  'All',
  'Artificial Intelligence',
  'Website & App Development',
  'Digital Business',
  'Digital Foundations',
];

export function CoursesPage({ onSelectCourse }: CoursesPageProps) {
  const { courses } = useAcademy();
  const [selectedCategory, setSelectedCategory] = useState<'All' | CourseCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-[70vh]">
      <section className="bg-navy-950 text-white py-14 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">
            COURSES &amp; TRAINING CATALOG
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance mb-4">
            Structured Digital Skills for Modern Careers &amp; Online Builders.
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Browse sample academy tracks below. Open any syllabus to inspect modules and test
            enrolling into your interactive Student Dashboard.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Interactive Filter Tabs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_TABS.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-navy-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sample courses..."
                aria-label="Search sample courses"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 focus:outline-none focus:border-royal-600"
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-900">
                No matching sample courses found
              </h2>
              <p className="text-sm text-slate-600">
                Try clearing your search filter or viewing all training categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-royal-600 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
