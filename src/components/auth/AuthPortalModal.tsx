import { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';

export function AuthPortalModal() {
  const {
    isAuthModalOpen,
    authModalInitialTab,
    closeAuthModal,
    signInWithGoogle,
    isAuthLoading,
    authError,
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(authModalInitialTab);
  const [trackInterest, setTrackInterest] = useState('Artificial Intelligence & Prompting');

  useEffect(() => {
    setActiveTab(authModalInitialTab);
  }, [authModalInitialTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="bg-navy-900 px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h2 id="portal-modal-title" className="font-display text-lg font-bold text-white">
              PRINCE JOE DIGITAL ACADEMY Portal
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Secured by Firebase Authentication &amp; Cloud Firestore
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-9 h-9 rounded-lg border border-navy-800 bg-navy-950/50 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close portal modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'login'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              New Student
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Admin Access
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'register' && (
            <div>
              <label
                htmlFor="google-track-interest"
                className="block text-sm font-medium text-navy-900 mb-1.5"
              >
                Choose Your Primary Learning Track
              </label>
              <select
                id="google-track-interest"
                value={trackInterest}
                onChange={(e) => setTrackInterest(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-white focus:outline-none focus:border-royal-600"
              >
                <option value="Artificial Intelligence & Prompting">
                  Artificial Intelligence &amp; Prompting
                </option>
                <option value="Website & App Development">Website &amp; App Development</option>
                <option value="Digital Business Opportunities">
                  Digital Business Opportunities
                </option>
                <option value="Essential Digital Foundations">Essential Digital Foundations</option>
              </select>
            </div>
          )}

          {activeTab === 'admin' ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-navy-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-royal-600" />
                Protected Administrator Permissions
              </p>
              <p>
                Only verified academy administrator Google accounts are granted access to the
                Admin Console. Regular student accounts cannot access or modify admin records.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-navy-900">Google Sign-In Privacy:</span> Your
              student profile and course progress are protected by Firestore Security Rules so only
              you (and verified academy administrators) can view your private records.
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {authError}
            </div>
          )}

          <button
            type="button"
            disabled={isAuthLoading}
            onClick={() =>
              void signInWithGoogle(activeTab === 'register' ? trackInterest : undefined)
            }
            className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-navy-900 border border-slate-300 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            {isAuthLoading ? 'Connecting with Google...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
