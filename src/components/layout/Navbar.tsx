import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { PageId } from '../../types/academy';
import { BrandCrest } from '../common/BrandCrest';

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'courses', label: 'Courses' },
  { id: 'web-app-dev', label: 'Web & App' },
  { id: 'digital-business', label: 'Business' },
  { id: 'news', label: 'AI News' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const { currentPage, navigate, activeUser, openAuthModal } = useAcademy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const handlePrimaryAction = () => {
    setMobileMenuOpen(false);
    if (!activeUser) {
      openAuthModal('login');
      return;
    }
    navigate(activeUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const primaryLabel = activeUser
    ? activeUser.role === 'admin'
      ? 'Admin Console'
      : 'My Dashboard'
    : 'Student Portal';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Clean single-line brand lockup */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer group"
        >
          <BrandCrest className="w-8 h-8 shrink-0" />
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-navy-900 group-hover:text-royal-600 transition-colors whitespace-nowrap shrink-0">
            PRINCE JOE DIGITAL ACADEMY
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-6" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive ? 'text-royal-600' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gold-500 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-royal-600 hover:bg-royal-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {primaryLabel}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-royal-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-navy-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-royal-600 hover:bg-royal-700 rounded-lg transition-colors cursor-pointer"
              >
                {primaryLabel}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
