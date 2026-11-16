export function BrandCrest({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" fill="#0B1C3E" />
      <path
        d="M20 6L31 11V19.5C31 26.2 26.3 31.8 20 34C13.7 31.8 9 26.2 9 19.5V11L20 6Z"
        stroke="#C59B27"
        strokeWidth="1.75"
        fill="#122854"
      />
      <path
        d="M14.5 16.5L20 13.5L25.5 16.5V23.5L20 26.5L14.5 23.5V16.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M20 13.5V26.5" stroke="#C59B27" strokeWidth="1.6" />
      <circle cx="20" cy="19.5" r="2.2" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
    </svg>
  );
}
