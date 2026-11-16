import { CheckCircle2, Layers } from 'lucide-react';
import { useState } from 'react';
import { MediaFrame } from '../components/common/MediaFrame';
import { CourseCard } from '../components/courses/CourseCard';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES } from '../data/sampleData';
import { Course } from '../types/academy';

interface WebAppDevPageProps {
  onSelectCourse: (course: Course) => void;
}

const DEVELOPMENT_STAGES = [
  {
    id: 'stage-1',
    step: '01. Semantic HTML & Responsive Layout',
    tools: ['HTML5 Structure', 'Tailwind CSS', 'Mobile-First Grids'],
    plainEnglish:
      'Every website starts with clean structure and readable typography. You will learn how layouts adapt smoothly across mobile phones, tablets, and wide desktop screens.',
    deliverable: 'A multi-section responsive landing page with accessible navigation.',
  },
  {
    id: 'stage-2',
    step: '02. Reusable React & TypeScript Components',
    tools: ['React Components', 'TypeScript Interfaces', 'Interactive State'],
    plainEnglish:
      'Instead of repeating code across pages, React lets you build reusable blocks—such as course cards, navigation bars, and syllabus modals—that stay easy to update.',
    deliverable: 'An interactive multi-page web application with live filtering and state.',
  },
  {
    id: 'stage-3',
    step: '03. Cloud Databases & User Authentication Prep',
    tools: ['Repository Pattern', 'Firebase Auth Concepts', 'Cloud Firestore Models'],
    plainEnglish:
      'We separate user interface code from data storage so your prototype can seamlessly connect to Firebase Authentication and Cloud Firestore when you are ready to launch.',
    deliverable: 'A structured student and admin data layer with clean security boundaries.',
  },
  {
    id: 'stage-4',
    step: '04. Security Hygiene & Production Deployment',
    tools: ['Environment Variables', 'Access Rules', 'Build Verification'],
    plainEnglish:
      'Before publishing any real project, you learn how to keep secret API keys out of browser code, validate user forms, and verify builds cleanly.',
    deliverable: 'A verified production build ready for custom domain hosting.',
  },
];

export function WebAppDevPage({ onSelectCourse }: WebAppDevPageProps) {
  const { courses } = useAcademy();
  const [activeStageId, setActiveStageId] = useState(DEVELOPMENT_STAGES[0].id);

  const webAppCourses = courses.filter((c) => c.category === 'Website & App Development');
  const activeStage =
    DEVELOPMENT_STAGES.find((s) => s.id === activeStageId) ?? DEVELOPMENT_STAGES[0];

  return (
    <div className="bg-slate-50">
      <section className="bg-navy-950 text-white py-14 lg:py-18 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">
              WEBSITE &amp; APP DEVELOPMENT TRAINING
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight text-balance mb-4">
              Learn to Design and Build Modern Websites &amp; Web Applications.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Follow a clear four-stage engineering pathway built specifically for beginners—from
              understanding basic webpage layout to architecting React applications ready for cloud
              databases.
            </p>
          </div>
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-navy-800 min-h-[240px]">
            <MediaFrame
              src={ACADEMY_IMAGES.webAppTrack}
              alt="Modern responsive web application on laptop and mobile phone"
              className="w-full h-full"
              fallbackTitle="Website & App Engineering"
            />
          </div>
        </div>
      </section>

      {/* Interactive 4-Stage Curriculum Explorer */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
              Interactive Development Roadmap
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select any stage below to see the core tools taught, plain-English purpose, and
              student project milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2.5">
              {DEVELOPMENT_STAGES.map((stage) => {
                const isSelected = stage.id === activeStage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-navy-900 border-navy-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-navy-900 hover:border-royal-600/50'
                    }`}
                  >
                    <p className="font-display text-sm sm:text-base font-bold">{stage.step}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {stage.tools.join(' · ')}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-royal-600">
                <Layers className="w-4 h-4" />
                <span>STAGE DETAILS</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-navy-900">{activeStage.step}</h3>
              <p className="text-base text-slate-700 leading-relaxed">{activeStage.plainEnglish}</p>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">CORE SKILLS COVERED</p>
                  <ul className="space-y-2">
                    {activeStage.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-2 text-sm text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">PRACTICAL MILESTONE</p>
                  <p className="text-sm text-navy-900 font-medium leading-relaxed">
                    {activeStage.deliverable}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-8">
            Website &amp; App Development Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webAppCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
