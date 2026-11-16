import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackTitle?: string;
}

export function MediaFrame({
  src,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  fallbackTitle,
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-royal-700 text-white p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-11 h-11 rounded-lg border border-gold-400/40 bg-navy-950/60 flex items-center justify-center mb-3">
          <BookOpen className="w-5 h-5 text-gold-400" />
        </div>
        <p className="font-display text-sm font-semibold text-white max-w-xs">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-navy-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={imgClassName}
      />
    </div>
  );
}
