import { Calendar, Clock, X } from 'lucide-react';
import { NewsArticle } from '../../types/academy';
import { MediaFrame } from '../common/MediaFrame';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export function NewsDetailModal({ article, onClose }: NewsDetailModalProps) {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-royal-600 font-semibold">{article.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedDate}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-navy-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Close article"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="aspect-[16/9] rounded-lg overflow-hidden border border-slate-200">
            <MediaFrame
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full"
              fallbackTitle={article.title}
            />
          </div>

          <header>
            <h2
              id="news-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-navy-900 leading-tight mb-2"
            >
              {article.title}
            </h2>
            <p className="text-xs text-slate-500">By {article.author}</p>
          </header>

          <div className="space-y-4 text-base text-slate-700 leading-relaxed">
            {article.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
