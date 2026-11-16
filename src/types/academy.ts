export type PageId =
  | 'home'
  | 'about'
  | 'news'
  | 'courses'
  | 'web-app-dev'
  | 'digital-business'
  | 'contact'
  | 'student-dashboard'
  | 'admin-dashboard';

export type CourseCategory =
  | 'Artificial Intelligence'
  | 'Website & App Development'
  | 'Digital Business'
  | 'Digital Foundations';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Builder';

export type UserRole = 'student' | 'admin';

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  durationWeeks: number;
  lessonsCount: number;
  featured: boolean;
  imageUrl: string;
  shortDescription: string;
  outcomes: string[];
  lessons: CourseLesson[];
  tuitionLabel: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Artificial Intelligence' | 'Web Engineering' | 'Digital Economy';
  publishedDate: string;
  readTimeMinutes: number;
  author: string;
  imageUrl: string;
  excerpt: string;
  body: string[];
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  modelType: string;
  startupRequirement: string;
  timeToFirstProject: string;
  coreSkills: string[];
  description: string;
  actionSteps: string[];
}

export interface AcademyUser {
  id: string;
  uid?: string;
  displayName: string;
  handle: string;
  email?: string;
  role: UserRole;
  joinedLabel: string;
  trackInterest: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  completedLessonIds: string[];
  status?: 'active' | 'completed';
}

export interface SiteContentConfig {
  academyName: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutMission: string;
  announcementLine: string;
}

export interface ContactInquiry {
  id: string;
  userId?: string;
  senderAlias: string;
  topic: string;
  message: string;
  submittedAt: string;
}
