import { ArrowRight } from 'lucide-react';
import { BrandCrest } from '../components/common/BrandCrest';
import { MediaFrame } from '../components/common/MediaFrame';
import { CourseCard } from '../components/courses/CourseCard';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES } from '../data/sampleData';
import { Course, NewsArticle } from '../types/academy';

interface HomePageProps {
  onSelectCourse: (course: Course) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

const LEARNING_PILLARS = [
  {
    number: '01',
    title: 'Beginner-First Plain English Guidance',
    description:
      'Every lesson starts from clear fundamentals so complete beginners understand how websites, AI models, and digital tools actually work together.',
  },
  {
    number: '02',
    title: 'Real Website & Application Engineering',
    description:
      'Move beyond passive theory by building responsive pages, reusable React components, student portals, and cloud-ready data structures.',
  },
  {
    number: '03',
    title: 'Practical AI Workflow Literacy',
    description:
      'Learn structured prompting, quality verification, and responsible AI automation workflows applicable to modern careers and businesses.',
  },
  {
    number: '04',
    title: 'Digital Business & Opportunity Readiness',
    description:
      'Connect technical skills directly to real online service models—from small-business web studios to digital products and remote consulting.',
  },
];

export function HomePage({ onSelectCourse, onSelectArticle }: HomePageProps) {
  const { courses, news, siteContent, navigate, openAuthModal, activeUser } = useAcademy();

  const featuredCourses = courses.filter((c) => c.featured).slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <div>
      {/* Welcome Banner / Hero Section */}
      <section className="bg-navy-950 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <BrandCrest className="w-9 h-9 shrink-0" />
                <span className="font-display text-xs sm:text-sm font-semibold tracking-wider text-gold-400">
                  {siteContent.academyName}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] tracking-tight text-balance mb-5">
                {siteContent.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
                {siteContent.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('courses')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    activeUser
                      ? navigate(
                          activeUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard'
                        )
                      : openAuthModal('register')
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gold-100 text-navy-950 text-sm font-semibold rounded-lg border border-gold-400/60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {activeUser ? 'Open My Dashboard' : 'Register Now'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-xl overflow-hidden border border-navy-800 shadow-xl min-h-[280px] sm:min-h-[360px]">
                <MediaFrame
                  src={ACADEMY_IMAGES.heroCampus}
                  alt="Students collaborating on laptops inside PRINCE JOE DIGITAL ACADEMY"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  fallbackTitle="PRINCE JOE DIGITAL ACADEMY Campus"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="bg-navy-900/90 border-t border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="font-mono tabular-nums text-2xl font-bold text-gold-400">
                  {courses.length} Tracks
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Sample courses across AI, Web &amp; Business
                </p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-300 mt-1">
                  Beginner-friendly plain-English instruction
                </p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-2xl font-bold text-white">
                  4 Core Pillars
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  AI, Websites, Apps &amp; Digital Entrepreneurship
                </p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-2xl font-bold text-gold-400">
                  Cloud-Ready
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Structured for Firebase Auth &amp; Firestore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-royal-600 mb-2">
                CURATED TRAINING TRACKS
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight text-balance">
                Featured Courses &amp; Training
              </h2>
              <p className="text-base text-slate-600 mt-2">
                Preview our core sample syllabi designed to guide new learners from first concepts
                to practical digital execution.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('courses')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Browse All Courses
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Students Should Learn With Us */}
      <section className="py-16 lg:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gold-500 mb-2">
                  WHY LEARN WITH US
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight text-balance mb-4">
                  Built for Clarity, Mentorship, and Real Outcomes.
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Starting in technology can feel overwhelming. Our curriculum removes guesswork by
                  explaining why each tool matters and how skills connect to real opportunities.
                </p>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[4/3]">
                <MediaFrame
                  src={ACADEMY_IMAGES.mentorship}
                  alt="Academy mentor guiding students through a practical software project"
                  className="w-full h-full"
                  fallbackTitle="Mentorship at PRINCE JOE DIGITAL ACADEMY"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {LEARNING_PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono tabular-nums text-sm font-bold text-gold-500 block mb-3">
                      {pillar.number}.
                    </span>
                    <h3 className="font-display text-lg font-bold text-navy-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest AI and Technology News */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-royal-600 mb-2">
                INDUSTRY PERSPECTIVES
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight text-balance">
                Latest AI &amp; Technology News
              </h2>
              <p className="text-base text-slate-600 mt-2">
                Clear, practical briefings on artificial intelligence, web architecture, and the
                digital economy.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('news')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Read All Briefings
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <article
                key={article.id}
                className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-royal-600/50 transition-colors"
              >
                <div className="aspect-[4/3] border-b border-slate-100">
                  <MediaFrame
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full"
                    fallbackTitle={article.title}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-2.5">
                    <span className="font-semibold text-royal-600">{article.category}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{article.publishedDate}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="font-mono tabular-nums">{article.readTimeMinutes} min</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-900 leading-snug mb-2.5 text-balance">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                    {article.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectArticle(article)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 transition-colors cursor-pointer self-start"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final Portal CTA Band */}
      <section className="bg-navy-900 text-white border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-gold-400 mb-2">
              FIREBASE-CONNECTED PORTALS
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              Sign In with Google to Track Your Courses or Manage the Academy.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              {siteContent.announcementLine}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="px-5 py-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Student Sign-In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('admin')}
              className="px-5 py-3 bg-navy-950 hover:bg-navy-800 text-gold-400 border border-gold-500/40 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Admin Console
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
