import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { MediaFrame } from '../components/common/MediaFrame';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES } from '../data/sampleData';

export function AboutPage() {
  const { siteContent, navigate, openAuthModal } = useAcademy();

  const roadmapSteps = [
    {
      step: '01. Understand Foundations',
      detail:
        'Start with clear, jargon-free explanations of how websites, artificial intelligence, and cloud tools work.',
    },
    {
      step: '02. Build Real Projects',
      detail:
        'Apply every concept inside practical exercises—responsive pages, interactive components, and tested AI prompts.',
    },
    {
      step: '03. Launch Digital Value',
      detail:
        'Connect your skills to freelance web services, AI workflow consulting, or your own online business idea.',
    },
  ];

  return (
    <div className="bg-slate-50">
      <section className="bg-navy-950 text-white py-14 lg:py-18 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">
            ABOUT THE ACADEMY
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance mb-4">
            Practical Technology Education Built for Beginners and Future Founders.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {siteContent.aboutMission}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 min-h-[300px]">
            <MediaFrame
              src={ACADEMY_IMAGES.mentorship}
              alt="Instructor mentoring learners at PRINCE JOE DIGITAL ACADEMY"
              className="w-full h-full"
              fallbackTitle="Academy Mentorship"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 text-balance">
              Why PRINCE JOE DIGITAL ACADEMY Was Created
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Too many technology tutorials assume learners already know complex engineering jargon.
              We take the opposite approach: teach every principle in plain English, organize code
              into clean building blocks, and keep real-world digital opportunities in focus from
              day one.
            </p>
            <ul className="space-y-3">
              {[
                'Structured pathways across AI, Website & App Development, and Digital Business',
                'Security-conscious habits taught early (protecting user data and secret keys)',
                'International visual and technical standards suitable for global remote work',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-8">
            Our Three-Stage Learning Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-2.5"
              >
                <h3 className="font-display text-lg font-bold text-navy-900">{item.step}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('courses')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Explore All Courses
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="px-5 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-navy-900 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Register Demo Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
