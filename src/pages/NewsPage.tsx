import { ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MediaFrame } from '../components/common/MediaFrame';
import { useAcademy } from '../context/AcademyContext';
import { NewsArticle } from '../types/academy';

interface NewsPageProps {
  onSelectArticle: (article: NewsArticle) => void;
}

const NEWS_CATEGORIES: ('All' | NewsArticle['category'])[] = [
  'All',
  'Artificial Intelligence',
  'Web Engineering',
  'Digital Economy',
];

export function NewsPage({ onSelectArticle }: NewsPageProps) {
  const { news } = useAcademy();
  const [selectedCategory, setSelectedCategory] = useState<'All' | NewsArticle['category']>('All');
  const [query, setQuery] = useState('');

  const filteredNews = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((article) => {
      const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [news, selectedCategory, query]);

  return (
    <div className="bg-slate-50 min-h-[70vh]">
      <section className="bg-navy-950 text-white py-14 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">
            AI &amp; TECHNOLOGY NEWS
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance mb-4">
            Clear Briefings on AI, Software Engineering &amp; Digital Trends.
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Stay informed with plain-English analysis of emerging tools, security practices, and
            real opportunities across the technology sector.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {NEWS_CATEGORIES.map((category) => {
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search briefings..."
                aria-label="Search briefings"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 focus:outline-none focus:border-royal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-royal-600/50 transition-colors"
              >
                <div className="sm:w-48 shrink-0 aspect-[4/3] sm:aspect-auto">
                  <MediaFrame
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full"
                    fallbackTitle={article.title}
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-royal-600">{article.category}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{article.publishedDate}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="font-mono tabular-nums">
                        {article.readTimeMinutes} min read
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-navy-900 leading-snug mb-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectArticle(article)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-navy-900 transition-colors cursor-pointer self-start"
                  >
                    Read Full Briefing
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
