import React, { useEffect, useState } from 'react';
import { Database, LogOut, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CourseCategory, CourseLevel } from '../types/academy';

export function AdminDashboardPage() {
  const {
    activeUser,
    authReady,
    hasRemoteCatalog,
    courses,
    users,
    enrollments,
    news,
    siteContent,
    seedCatalogNow,
    addCourseAdmin,
    updateCourseAdmin,
    deleteCourseAdmin,
    updateSiteContentAdmin,
    openAuthModal,
    signOut,
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'content'>('courses');

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CourseCategory>('Artificial Intelligence');
  const [newLevel, setNewLevel] = useState<CourseLevel>('Beginner');
  const [newWeeks, setNewWeeks] = useState(6);
  const [newDesc, setNewDesc] = useState('');
  const [courseFeedback, setCourseFeedback] = useState<string | null>(null);
  const [seedingBusy, setSeedingBusy] = useState(false);

  // Content Editor State
  const [heroHeadline, setHeroHeadline] = useState(siteContent.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(siteContent.heroSubheadline);
  const [aboutMission, setAboutMission] = useState(siteContent.aboutMission);
  const [announcementLine, setAnnouncementLine] = useState(siteContent.announcementLine);
  const [contentSaved, setContentSaved] = useState(false);

  useEffect(() => {
    setHeroHeadline(siteContent.heroHeadline);
    setHeroSubheadline(siteContent.heroSubheadline);
    setAboutMission(siteContent.aboutMission);
    setAnnouncementLine(siteContent.announcementLine);
  }, [siteContent]);

  if (!authReady) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-slate-600">
        Verifying administrator permissions...
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-navy-900">
          Academy Owner Admin Console
        </h1>
        <p className="text-base text-slate-600">
          Sign in with your verified administrator Google account to manage courses, students, and
          website content in Cloud Firestore.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('admin')}
          className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg cursor-pointer"
        >
          Sign in as Administrator
        </button>
      </div>
    );
  }

  if (activeUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
        <h1 className="font-display text-2xl font-bold text-navy-900">
          Administrator Permission Required
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          You are currently signed in as a Student ({activeUser.displayName}). Student accounts
          cannot access administrator tools or modify academy courses.
        </p>
      </div>
    );
  }

  const studentUsers = users.filter((u) => u.role === 'student');

  const handleSeedCatalog = async () => {
    setSeedingBusy(true);
    try {
      await seedCatalogNow();
      setCourseFeedback('Sample courses, news, and site content synced to Cloud Firestore.');
    } catch (err) {
      setCourseFeedback(err instanceof Error ? err.message : 'Unable to seed catalog.');
    } finally {
      setSeedingBusy(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length < 3 || newDesc.trim().length < 10) {
      setCourseFeedback('Please provide a clear course title and at least 10 characters of description.');
      return;
    }
    try {
      await addCourseAdmin({
        title: newTitle,
        category: newCategory,
        level: newLevel,
        durationWeeks: newWeeks,
        shortDescription: newDesc,
      });
      setNewTitle('');
      setNewDesc('');
      setCourseFeedback('New course saved to Cloud Firestore.');
    } catch (err) {
      setCourseFeedback(err instanceof Error ? err.message : 'Failed to create course.');
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteContentAdmin({
      heroHeadline,
      heroSubheadline,
      aboutMission,
      announcementLine,
    });
    setContentSaved(true);
  };

  return (
    <div className="bg-slate-50 min-h-[75vh] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Owner Header */}
        <div className="bg-navy-950 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-gold-400 mb-1">
              ADMINISTRATOR CONSOLE &middot; FIREBASE SECURED
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {siteContent.academyName} Management
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Signed in as verified administrator ({activeUser.email || activeUser.displayName}).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!hasRemoteCatalog && (
              <button
                type="button"
                disabled={seedingBusy}
                onClick={() => void handleSeedCatalog()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-60"
              >
                <Database className="w-3.5 h-3.5" />
                {seedingBusy ? 'Publishing...' : 'Publish Sample Catalog to Firestore'}
              </button>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-navy-950 text-xs font-semibold rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabular KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Published Courses</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-navy-900 mt-1">
              {courses.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Registered Students</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-navy-900 mt-1">
              {studentUsers.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Total Enrollments</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-royal-600 mt-1">
              {enrollments.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">AI News Briefings</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-navy-900 mt-1">
              {news.length}
            </p>
          </div>
        </div>

        {/* Workspace Section Tabs */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-lg gap-1">
          {(
            [
              { id: 'courses', label: 'Manage Courses' },
              { id: 'students', label: 'Manage Students' },
              { id: 'content', label: 'Website Content' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Courses Management */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Add New Course to Firestore
              </h2>
              <form onSubmit={(e) => void handleAddCourse(e)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. No-Code Automation for Beginners"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CourseCategory)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Website & App Development">Website &amp; App Development</option>
                      <option value="Digital Business">Digital Business</option>
                      <option value="Digital Foundations">Digital Foundations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Level
                    </label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as CourseLevel)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Builder">Builder</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={newWeeks}
                    onChange={(e) => setNewWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Plain-English overview of what learners will build..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                {courseFeedback && (
                  <p className="text-xs font-medium text-royal-600">{courseFeedback}</p>
                )}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish Course
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Active Course Catalog
                </h2>
                <span className="text-xs text-slate-500">
                  {hasRemoteCatalog ? 'Synced with Cloud Firestore' : 'Preview Catalog (Not Seeded)'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Course Title</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4 text-right">Weeks</th>
                      <th className="py-3 px-4 text-center">Homepage</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-navy-900">{course.title}</p>
                          <p className="text-xs text-slate-500">{course.category}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{course.level}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                          {course.durationWeeks}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              void updateCourseAdmin(course.id, { featured: !course.featured })
                            }
                            className={`text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer ${
                              course.featured
                                ? 'bg-gold-100 border-gold-400 text-navy-900'
                                : 'bg-white border-slate-300 text-slate-600'
                            }`}
                          >
                            {course.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => void deleteCourseAdmin(course.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            aria-label={`Remove ${course.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Student Roster */}
        {activeTab === 'students' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Registered Students &amp; Enrollments
              </h2>
            </div>
            {studentUsers.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-600">
                No students have signed in with Google yet. When students register, their non-PII
                profile summary and course counts will appear here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Student Profile</th>
                      <th className="py-3 px-4">Primary Interest</th>
                      <th className="py-3 px-4">Joined</th>
                      <th className="py-3 px-4 text-right">Courses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentUsers.map((student) => {
                      const count = enrollments.filter((e) => e.userId === student.id).length;
                      return (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-semibold text-navy-900">
                            {student.displayName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{student.trackInterest}</td>
                          <td className="py-3.5 px-4 text-slate-500">{student.joinedLabel}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-navy-900">
                            {count}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Website Content Manager */}
        {activeTab === 'content' && (
          <form
            onSubmit={(e) => void handleSaveContent(e)}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-3xl space-y-5"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">
                Edit Homepage &amp; Academy Copy
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Saves directly to Cloud Firestore (`siteContent/main`) for all visitors.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Homepage Welcome Headline
              </label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => {
                  setHeroHeadline(e.target.value);
                  setContentSaved(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Homepage Description
              </label>
              <textarea
                rows={3}
                value={heroSubheadline}
                onChange={(e) => {
                  setHeroSubheadline(e.target.value);
                  setContentSaved(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                About Academy Mission Statement
              </label>
              <textarea
                rows={3}
                value={aboutMission}
                onChange={(e) => {
                  setAboutMission(e.target.value);
                  setContentSaved(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Announcement Callout Line
              </label>
              <input
                type="text"
                value={announcementLine}
                onChange={(e) => {
                  setAnnouncementLine(e.target.value);
                  setContentSaved(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            {contentSaved && (
              <p className="text-xs font-semibold text-emerald-700">
                Website content saved to Cloud Firestore!
              </p>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg cursor-pointer"
            >
              Save Website Copy
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
