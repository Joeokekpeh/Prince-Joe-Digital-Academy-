import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { MediaFrame } from '../components/common/MediaFrame';
import { CourseCard } from '../components/courses/CourseCard';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES, BUSINESS_OPPORTUNITIES } from '../data/sampleData';
import { Course } from '../types/academy';

interface DigitalBusinessPageProps {
  onSelectCourse: (course: Course) => void;
}

export function DigitalBusinessPage({ onSelectCourse }: DigitalBusinessPageProps) {
  const { courses } = useAcademy();
  const [selectedOppId, setSelectedOppId] = useState(BUSINESS_OPPORTUNITIES[0].id);

  const businessCourses = courses.filter((c) => c.category === 'Digital Business');
  const selectedOpp =
    BUSINESS_OPPORTUNITIES.find((o) => o.id === selectedOppId) ?? BUSINESS_OPPORTUNITIES[0];

  return (
    <div className="bg-slate-50">
      <section className="bg-navy-950 text-white py-14 lg:py-18 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">
              DIGITAL BUSINESS OPPORTUNITIES
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight text-balance mb-4">
              Turn Digital Skills Into Sustainable Online Services &amp; Ventures.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Explore practical, ethical online business models—designed for learners starting with
              a laptop, structured skills, and consistent problem-solving.
            </p>
          </div>
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-navy-800 min-h-[240px]">
            <MediaFrame
              src={ACADEMY_IMAGES.digitalBusiness}
              alt="Digital entrepreneur reviewing global online commerce strategy"
              className="w-full h-full"
              fallbackTitle="Digital Business Opportunities"
            />
          </div>
        </div>
      </section>

      {/* Interactive Opportunity Explorer */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
              Compare Practical Online Business Paths
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select an opportunity below to inspect required skills, startup needs, and first-step
              execution checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2.5">
              {BUSINESS_OPPORTUNITIES.map((opp) => {
                const active = opp.id === selectedOpp.id;
                return (
                  <button
                    key={opp.id}
                    type="button"
                    onClick={() => setSelectedOppId(opp.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-navy-900 border-navy-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-navy-900 hover:border-royal-600/50'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 opacity-80">
                      {opp.modelType} &middot; {opp.timeToFirstProject}
                    </div>
                    <p className="font-display text-base font-bold">{opp.title}</p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold text-royal-600 mb-1">
                  {selectedOpp.modelType} &middot; {selectedOpp.startupRequirement}
                </p>
                <h3 className="font-display text-2xl font-bold text-navy-900">
                  {selectedOpp.title}
                </h3>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">{selectedOpp.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2.5">KEY SKILLS NEEDED</p>
                  <ul className="space-y-2">
                    {selectedOpp.coreSkills.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2.5">
                    FIRST 3 ACTION STEPS
                  </p>
                  <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
                    {selectedOpp.actionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Tabular Summary Grid */}
          <div className="mt-12 overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">Opportunity Model</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Starting Requirement</th>
                  <th className="py-3.5 px-4 text-right">Typical Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {BUSINESS_OPPORTUNITIES.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">{opp.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{opp.modelType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{opp.startupRequirement}</td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-navy-900">
                      {opp.timeToFirstProject}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-8">
            Digital Business Training Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
