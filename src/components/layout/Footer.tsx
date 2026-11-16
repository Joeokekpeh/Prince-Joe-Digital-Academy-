import { useAcademy } from '../../context/AcademyContext';
import { PageId } from '../../types/academy';
import { BrandCrest } from '../common/BrandCrest';

export function Footer() {
  const { navigate, openAuthModal, activeUser } = useAcademy();

  const academyLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About the Academy' },
    { id: 'courses', label: 'Courses and Training' },
    { id: 'web-app-dev', label: 'Website & App Development' },
  ];

  const resourceLinks: { id: PageId; label: string }[] = [
    { id: 'digital-business', label: 'Digital Business Opportunities' },
    { id: 'news', label: 'AI and Technology News' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandCrest className="w-8 h-8 shrink-0" />
              <span className="font-display text-sm font-bold text-white tracking-tight">
                PRINCE JOE DIGITAL ACADEMY
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              Practical international training in artificial intelligence, website &amp; app
              development, digital fluency, and online business systems.
            </p>
            <p className="text-xs text-gold-400 font-medium">
              Beginner-First Technology Education
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Academy Pages</h3>
            <ul className="space-y-2.5 text-sm">
              {academyLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => navigate(link.id)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Tracks &amp; Updates
            </h3>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => navigate(link.id)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Student &amp; Admin Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    activeUser?.role === 'student'
                      ? navigate('student-dashboard')
                      : openAuthModal('login')
                  }
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Student Google Sign-In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Student Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    activeUser?.role === 'admin'
                      ? navigate('admin-dashboard')
                      : openAuthModal('admin')
                  }
                  className="text-gold-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Academy Owner Admin Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} PRINCE JOE DIGITAL ACADEMY. Preview environment (no
            payments enabled).
          </p>
          <p>Connected to Firebase Authentication &amp; Cloud Firestore.</p>
        </div>
      </div>
    </footer>
  );
}
