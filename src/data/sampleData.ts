import {
  AcademyUser,
  BusinessOpportunity,
  Course,
  CourseEnrollment,
  NewsArticle,
  SiteContentConfig,
} from '../types/academy';

export const ACADEMY_IMAGES = {
  heroCampus: '/src/assets/images/hero_academy_campus_1794819080034.jpg',
  aiTrack: '/src/assets/images/track_ai_skills_1794819081262.jpg',
  webAppTrack: '/src/assets/images/track_web_app_dev_1794819081278.jpg',
  digitalBusiness: '/src/assets/images/track_digital_business_1794819081616.jpg',
  mentorship: '/src/assets/images/about_academy_mentorship_1794819081693.jpg',
} as const;

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  academyName: 'PRINCE JOE DIGITAL ACADEMY',
  heroHeadline: 'Master AI, Web Development, and Modern Digital Business.',
  heroSubheadline:
    'Structured, beginner-friendly technology education designed to take you from zero experience to building real websites, intelligent workflows, and sustainable online ventures.',
  aboutMission:
    'PRINCE JOE DIGITAL ACADEMY exists to make high-value digital engineering, practical artificial intelligence, and online entrepreneurship clear, structured, and accessible for ambitious beginners worldwide.',
  announcementLine:
    'New Cohort Preview Open: Explore our sample curriculum in AI Literacy, React Web Engineering, and Digital Business Systems.',
};

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-ai-foundations',
    title: 'Practical Artificial Intelligence & Prompt Engineering',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    durationWeeks: 6,
    lessonsCount: 5,
    featured: true,
    imageUrl: ACADEMY_IMAGES.aiTrack,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Learn how modern AI models work, write reliable structured prompts, and build everyday productivity and research workflows without coding experience.',
    outcomes: [
      'Design repeatable prompt templates for writing, research, and planning',
      'Evaluate AI outputs critically for accuracy, tone, and factual safety',
      'Automate repetitive document and content workflows responsibly',
    ],
    lessons: [
      {
        id: 'ai-1',
        title: '01. How Modern AI Assistants Think & Predict',
        durationMinutes: 25,
        summary: 'Plain-English introduction to language models, tokens, and context windows.',
      },
      {
        id: 'ai-2',
        title: '02. The Four-Part Structured Prompt Blueprint',
        durationMinutes: 35,
        summary: 'Role, context, constraints, and output format for consistent results.',
      },
      {
        id: 'ai-3',
        title: '03. AI Research, Summarization & Fact Verification',
        durationMinutes: 30,
        summary: 'How to avoid AI hallucinations and verify sources cleanly.',
      },
      {
        id: 'ai-4',
        title: '04. Everyday Workflow Automation for Business',
        durationMinutes: 40,
        summary: 'Turn multi-step weekly tasks into clean 10-minute AI routines.',
      },
      {
        id: 'ai-5',
        title: '05. Capstone: Build Your Personal AI Toolkit',
        durationMinutes: 45,
        summary: 'Assemble a documented prompt library tailored to your career goals.',
      },
    ],
  },
  {
    id: 'course-web-react',
    title: 'Modern Website Development with HTML, CSS & React',
    category: 'Website & App Development',
    level: 'Beginner',
    durationWeeks: 10,
    lessonsCount: 5,
    featured: true,
    imageUrl: ACADEMY_IMAGES.webAppTrack,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Start from your very first webpage and progress step-by-step to building responsive, multi-page React websites with clean reusable components.',
    outcomes: [
      'Structure clean semantic HTML5 and responsive Tailwind CSS layouts',
      'Build reusable React components and interactive navigation state',
      'Prepare your codebase cleanly for cloud hosting and future databases',
    ],
    lessons: [
      {
        id: 'web-1',
        title: '01. How Websites Work: Browsers, HTML & Structure',
        durationMinutes: 30,
        summary: 'Understand files, folders, semantic tags, and page hierarchy.',
      },
      {
        id: 'web-2',
        title: '02. Responsive Styling for Phones, Tablets & Desktops',
        durationMinutes: 40,
        summary: 'Master flexbox, CSS grid, typography scale, and color contrast.',
      },
      {
        id: 'web-3',
        title: '03. Thinking in React Components & Props',
        durationMinutes: 45,
        summary: 'Break large pages into clean, reusable UI building blocks.',
      },
      {
        id: 'web-4',
        title: '04. Interactive Forms, State & Multi-Page Routing',
        durationMinutes: 45,
        summary: 'Handle user clicks, input validation, and dynamic views safely.',
      },
      {
        id: 'web-5',
        title: '05. Capstone: Launch-Ready Academy Portfolio Site',
        durationMinutes: 60,
        summary: 'Publish a responsive multi-page site with clean code organization.',
      },
    ],
  },
  {
    id: 'course-digital-business',
    title: 'Digital Business Models & Online Opportunity Systems',
    category: 'Digital Business',
    level: 'Beginner',
    durationWeeks: 8,
    lessonsCount: 4,
    featured: true,
    imageUrl: ACADEMY_IMAGES.digitalBusiness,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Understand how digital services, online education, e-commerce, and client consulting work—and design a realistic first offer from scratch.',
    outcomes: [
      'Compare low-capital online business models with clear revenue math',
      'Define a clear digital service offer and target client profile',
      'Set up ethical lead capture, onboarding, and client delivery processes',
    ],
    lessons: [
      {
        id: 'biz-1',
        title: '01. Mapping the Global Digital Economy',
        durationMinutes: 30,
        summary: 'Service agencies, digital products, SaaS, and remote consulting compared.',
      },
      {
        id: 'biz-2',
        title: '02. Designing a Clear, High-Trust Service Offer',
        durationMinutes: 35,
        summary: 'Solve one specific problem clearly rather than selling vague skills.',
      },
      {
        id: 'biz-3',
        title: '03. Landing Pages & Ethical Client Acquisition',
        durationMinutes: 40,
        summary: 'Structure proof, case studies, and clear calls to action.',
      },
      {
        id: 'biz-4',
        title: '04. Project Delivery, Pricing & Long-Term Retainers',
        durationMinutes: 35,
        summary: 'Create dependable workflows that earn repeat client referrals.',
      },
    ],
  },
  {
    id: 'course-full-stack-apps',
    title: 'Web & Mobile App Architecture with Cloud Databases',
    category: 'Website & App Development',
    level: 'Intermediate',
    durationWeeks: 12,
    lessonsCount: 4,
    featured: false,
    imageUrl: ACADEMY_IMAGES.heroCampus,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Learn how real web applications connect user login, cloud databases, and security rules using modern TypeScript and Firebase patterns.',
    outcomes: [
      'Model users, courses, and enrollments cleanly in document databases',
      'Implement secure role-based authentication for students and admins',
      'Protect secret API keys and enforce strict database access rules',
    ],
    lessons: [
      {
        id: 'app-1',
        title: '01. Frontend vs Backend: Where Data & Secrets Live',
        durationMinutes: 35,
        summary: 'Why sensitive keys never belong in browser code.',
      },
      {
        id: 'app-2',
        title: '02. Designing Collections & TypeScript Data Models',
        durationMinutes: 45,
        summary: 'Structure scalable student, course, and progress records.',
      },
      {
        id: 'app-3',
        title: '03. Authentication Flows & Role Permissions',
        durationMinutes: 45,
        summary: 'Separate student access from academy owner admin controls.',
      },
      {
        id: 'app-4',
        title: '04. Production Deployment & Security Checklist',
        durationMinutes: 40,
        summary: 'Verify rules, test edge cases, and prepare for real users.',
      },
    ],
  },
  {
    id: 'course-ai-web-builders',
    title: 'AI-Assisted Website & Product Building for Creators',
    category: 'Artificial Intelligence',
    level: 'Builder',
    durationWeeks: 6,
    lessonsCount: 4,
    featured: false,
    imageUrl: ACADEMY_IMAGES.aiTrack,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Combine human architecture skills with modern AI coding assistants to prototype, test, and refine digital products twice as fast.',
    outcomes: [
      'Break product ideas into clear technical specifications before building',
      'Review AI-generated code for clarity, accessibility, and security',
      'Iterate from initial prototype to polished client-ready web experience',
    ],
    lessons: [
      {
        id: 'aiw-1',
        title: '01. Writing Clear Product Briefs for Technical Builds',
        durationMinutes: 30,
        summary: 'Translate business goals into exact page and feature specs.',
      },
      {
        id: 'aiw-2',
        title: '02. Inspecting Layout, Responsiveness & Accessibility',
        durationMinutes: 35,
        summary: 'Check mobile, tablet, and desktop layouts systematically.',
      },
      {
        id: 'aiw-3',
        title: '03. Debugging & Understanding Browser Console Feedback',
        durationMinutes: 40,
        summary: 'Read error messages calmly and solve root causes step-by-step.',
      },
      {
        id: 'aiw-4',
        title: '04. Launching Your First Prototype Safely',
        durationMinutes: 35,
        summary: 'Test with sample data before collecting real user accounts.',
      },
    ],
  },
  {
    id: 'course-digital-literacy',
    title: 'Essential Digital Fluency & Remote Career Readiness',
    category: 'Digital Foundations',
    level: 'Beginner',
    durationWeeks: 4,
    lessonsCount: 4,
    featured: false,
    imageUrl: ACADEMY_IMAGES.mentorship,
    tuitionLabel: 'Sample Curriculum',
    shortDescription:
      'Build rock-solid confidence with cloud collaboration, cybersecurity habits, GitHub fundamentals, and modern remote workplace tools.',
    outcomes: [
      'Organize cloud workspaces, version history, and collaborative docs',
      'Apply strong password, two-factor, and phishing defense habits',
      'Present your skills professionally to global remote teams',
    ],
    lessons: [
      {
        id: 'dig-1',
        title: '01. Cloud Workspaces & Structured File Management',
        durationMinutes: 25,
        summary: 'Keep projects, backups, and team folders cleanly organized.',
      },
      {
        id: 'dig-2',
        title: '02. Digital Security & Safe Online Habits',
        durationMinutes: 30,
        summary: 'Protect accounts, devices, and client trust from day one.',
      },
      {
        id: 'dig-3',
        title: '03. Introduction to Version Control & Project Tracking',
        durationMinutes: 35,
        summary: 'How teams save milestones without losing working code.',
      },
      {
        id: 'dig-4',
        title: '04. Communicating Clearly in Global Tech Teams',
        durationMinutes: 30,
        summary: 'Write concise project updates, briefs, and portfolio summaries.',
      },
    ],
  },
];

export const SAMPLE_NEWS: NewsArticle[] = [
  {
    id: 'news-ai-literacy-2026',
    title: 'Why Structured AI Literacy Is Now a Core Career Skill Across Every Industry',
    category: 'Artificial Intelligence',
    publishedDate: 'November 12, 2026',
    readTimeMinutes: 4,
    author: 'PRINCE JOE Editorial Desk',
    imageUrl: ACADEMY_IMAGES.aiTrack,
    excerpt:
      'Employers and small businesses increasingly value practitioners who combine domain judgment with reliable AI workflow design.',
    body: [
      'Across software engineering, education, finance, and digital commerce, artificial intelligence has moved from novelty experimentation to everyday operational infrastructure.',
      'However, knowing how to type a casual question into a chat box is very different from designing a dependable workflow. Organizations need builders who understand context framing, verification, data privacy, and human review.',
      'At PRINCE JOE DIGITAL ACADEMY, our curriculum teaches beginners to treat AI as a structured engineering partner—starting with clear problem statements, testing edge cases, and keeping human accountability at the center of every deliverable.',
    ],
  },
  {
    id: 'news-react-components',
    title: 'Component-Based Web Engineering: How Beginners Build Faster Without Messy Code',
    category: 'Web Engineering',
    publishedDate: 'November 8, 2026',
    readTimeMinutes: 5,
    author: 'Engineering Faculty',
    imageUrl: ACADEMY_IMAGES.webAppTrack,
    excerpt:
      'Breaking a website into small, single-purpose React components makes your first project easier to test, update, and scale.',
    body: [
      'One of the biggest hurdles for first-time website creators is writing hundreds of lines in a single file. When one button breaks, everything feels fragile.',
      'Modern React development solves this by organizing the interface into clear, reusable pieces: a navigation bar, a course card, a syllabus modal, and a dashboard panel. Each piece has one clear responsibility.',
      'When you pair reusable components with TypeScript data definitions, adding a cloud database later—such as Cloud Firestore—requires updating only your data service rather than rewriting your entire interface.',
    ],
  },
  {
    id: 'news-digital-micro-agencies',
    title: 'How Independent Digital Builders Turn Web & AI Skills into Service Businesses',
    category: 'Digital Economy',
    publishedDate: 'November 3, 2026',
    readTimeMinutes: 4,
    author: 'Digital Business Desk',
    imageUrl: ACADEMY_IMAGES.digitalBusiness,
    excerpt:
      'Small businesses worldwide need modern responsive websites, automated inquiry handling, and clear digital storefronts.',
    body: [
      'You do not need venture capital or a large office to start solving real problems online. Local clinics, schools, consultants, and retail shops regularly struggle with outdated websites and manual booking sheets.',
      'Learners who combine clean responsive web design with practical AI customer-support workflows can package clear, fixed-scope projects that deliver immediate measurable value to business owners.',
      'Our Digital Business Opportunities track walks step-by-step through scoping a first project, presenting prototypes transparently, and delivering maintainable digital systems.',
    ],
  },
  {
    id: 'news-cloud-security-basics',
    title: 'Security First for New Builders: Protecting Keys, Users, and Prototype Data',
    category: 'Web Engineering',
    publishedDate: 'October 28, 2026',
    readTimeMinutes: 3,
    author: 'PRINCE JOE Editorial Desk',
    imageUrl: ACADEMY_IMAGES.heroCampus,
    excerpt:
      'Understanding what belongs in browser code versus server environments is essential before launching any public web application.',
    body: [
      'Every browser loads your website’s frontend JavaScript directly onto a visitor’s phone or laptop. That means secret API keys or administrative credentials placed in frontend code can be read by anyone.',
      'Starting with clean separation—sample data during early prototyping, environment variables on the server, and strict authentication rules when connecting Firebase—keeps both your academy and your future learners protected from day one.',
    ],
  },
];

export const BUSINESS_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: 'opp-web-studio',
    title: 'Small-Business Website & Landing Page Studio',
    modelType: 'Client Service',
    startupRequirement: 'Laptop + Portfolio Prototype',
    timeToFirstProject: '6 to 10 Weeks of Study',
    coreSkills: ['HTML & Tailwind CSS', 'React Components', 'Responsive Layout'],
    description:
      'Build clean, mobile-friendly websites and booking pages for local businesses, educators, clinics, and independent consultants.',
    actionSteps: [
      'Create 2 polished sample websites in your academy portfolio',
      'Offer a clear 5-page business site package with mobile optimization',
      'Deliver clean documentation so the client can maintain content easily',
    ],
  },
  {
    id: 'opp-ai-workflow',
    title: 'AI Workflow & Content Operations Consulting',
    modelType: 'Advisory & Automation',
    startupRequirement: 'Documented Prompt Systems',
    timeToFirstProject: '4 to 6 Weeks of Study',
    coreSkills: ['Structured Prompting', 'Process Mapping', 'Quality Verification'],
    description:
      'Help growing teams save hours each week by organizing AI-assisted research, customer FAQ drafting, and internal knowledge bases.',
    actionSteps: [
      'Audit a real weekly workflow and measure baseline hours spent',
      'Build a tested prompt playbook with human review checkpoints',
      'Train the team with a clear 1-hour handover workshop',
    ],
  },
  {
    id: 'opp-digital-products',
    title: 'Specialized Digital Templates & Mini-Courses',
    modelType: 'Digital Product',
    startupRequirement: 'Deep Focus on One Niche',
    timeToFirstProject: '8 to 12 Weeks of Study',
    coreSkills: ['Curriculum Design', 'Web Publishing', 'Audience Education'],
    description:
      'Package practical checklists, starter website templates, or focused video guides that learners and professionals can purchase globally.',
    actionSteps: [
      'Validate one recurring beginner problem through direct conversations',
      'Publish free educational tutorials to demonstrate teaching clarity',
      'Launch a structured starter kit with clear before-and-after outcomes',
    ],
  },
  {
    id: 'opp-webapp-mvp',
    title: 'Custom Web App & Portal Prototyping',
    modelType: 'Technical Build',
    startupRequirement: 'Full-Stack Foundations',
    timeToFirstProject: '12+ Weeks of Study',
    coreSkills: ['React & TypeScript', 'Cloud Firestore Models', 'Auth & Security'],
    description:
      'Partner with founders and organizations to build member portals, booking dashboards, and internal tracking applications.',
    actionSteps: [
      'Define clean user roles (member vs admin) before writing code',
      'Build an interactive prototype first for rapid stakeholder review',
      'Connect authenticated cloud storage with strict security rules',
    ],
  },
];

export const SAMPLE_USERS: AcademyUser[] = [
  {
    id: 'demo-student-1',
    displayName: 'Adaeze Okafor (Sample Student)',
    handle: 'adaeze.sample',
    role: 'student',
    joinedLabel: 'Cohort Preview · Nov 2026',
    trackInterest: 'Artificial Intelligence & Web Development',
  },
  {
    id: 'demo-student-2',
    displayName: 'Samuel Mensah (Sample Student)',
    handle: 'samuel.sample',
    role: 'student',
    joinedLabel: 'Cohort Preview · Nov 2026',
    trackInterest: 'Digital Business Opportunities',
  },
  {
    id: 'demo-admin-1',
    displayName: 'Prince Joe (Academy Owner)',
    handle: 'owner.admin',
    role: 'admin',
    joinedLabel: 'Founder & Administrator',
    trackInterest: 'Academy Operations & Curriculum',
  },
];

export const SAMPLE_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: 'enr-1',
    userId: 'demo-student-1',
    courseId: 'course-ai-foundations',
    enrolledDate: 'Nov 10, 2026',
    completedLessonIds: ['ai-1', 'ai-2'],
  },
  {
    id: 'enr-2',
    userId: 'demo-student-1',
    courseId: 'course-web-react',
    enrolledDate: 'Nov 12, 2026',
    completedLessonIds: ['web-1'],
  },
  {
    id: 'enr-3',
    userId: 'demo-student-2',
    courseId: 'course-digital-business',
    enrolledDate: 'Nov 11, 2026',
    completedLessonIds: ['biz-1', 'biz-2', 'biz-3'],
  },
];
