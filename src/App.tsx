import { useState } from 'react';
import { AuthPortalModal } from './components/auth/AuthPortalModal';
import { CourseDetailModal } from './components/courses/CourseDetailModal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { NewsDetailModal } from './components/news/NewsDetailModal';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ContactPage } from './pages/ContactPage';
import { CoursesPage } from './pages/CoursesPage';
import { DigitalBusinessPage } from './pages/DigitalBusinessPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { WebAppDevPage } from './pages/WebAppDevPage';
import { Course, NewsArticle } from './types/academy';

function AcademyShell() {
  const { currentPage } = useAcademy();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onSelectCourse={setSelectedCourse} onSelectArticle={setSelectedArticle} />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'news' && <NewsPage onSelectArticle={setSelectedArticle} />}
        {currentPage === 'courses' && <CoursesPage onSelectCourse={setSelectedCourse} />}
        {currentPage === 'web-app-dev' && <WebAppDevPage onSelectCourse={setSelectedCourse} />}
        {currentPage === 'digital-business' && (
          <DigitalBusinessPage onSelectCourse={setSelectedCourse} />
        )}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'student-dashboard' && (
          <StudentDashboardPage onSelectCourse={setSelectedCourse} />
        )}
        {currentPage === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      <Footer />

      <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      <AuthPortalModal />
    </div>
  );
}

export default function App() {
  return (
    <AcademyProvider>
      <AcademyShell />
    </AcademyProvider>
  );
}
