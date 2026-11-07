// =====================================================
// PROJECT CONTENT MOCK DATA - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import { Block, MultilingualContent, MultilingualCaption } from '../components/blocks/blockTypes';

// Helper to create multilingual content
const mc = (en: string, ar: string = ''): MultilingualContent => ({ en, ar });
const mcap = (en: string, ar: string = ''): MultilingualCaption => ({ en, ar });

const DEMO_PROJECT_CONTENT: Record<string, Block[]> = {
  'proj-001': [
    {
      id: 'block-1',
      type: 'title',
      content: mc('AXIOMX Admin Dashboard - Project Overview', 'لوحة تحكم AXIOMX - نظرة عامة على المشروع'),
      level: 1,
    },
    {
      id: 'block-2',
      type: 'richText',
      content: mc(
        'AXIOMX Admin Dashboard is a comprehensive solution designed for enterprise-level organizations. It provides real-time insights, employee management, and seamless project tracking capabilities. Built with modern web technologies, it ensures optimal performance and user experience across all devices.',
        'لوحة تحكم AXIOMX هي حل شامل مصمم للمنظمات على مستوى المؤسسات. يوفر رؤى في الوقت الفعلي وإدارة الموظفين وتتبع المشاريع بسلاسة.'
      ),
    },
    {
      id: 'block-3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      alt: mc('Dashboard Interface', 'واجهة لوحة التحكم'),
      caption: mcap('Main Dashboard Interface', 'واجهة لوحة التحكم الرئيسية'),
    },
    {
      id: 'block-4',
      type: 'divider',
      style: 'dots',
    },
    {
      id: 'block-5',
      type: 'title',
      content: mc('Key Features', 'المميزات الرئيسية'),
      level: 2,
    },
    {
      id: 'block-6',
      type: 'richText',
      content: mc(
        'Our dashboard includes powerful features that help organizations manage their workflows efficiently. From real-time analytics to automated reporting, every aspect has been carefully crafted to meet the needs of modern businesses.',
        'تتضمن لوحتنا ميزات قوية تساعد المنظمات على إدارة سير العمل بكفاءة. من التحليلات في الوقت الفعلي إلى التقارير الآلية.'
      ),
    },
    {
      id: 'block-7',
      type: 'gallery',
      layout: 'grid',
      images: [
        { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', alt: mc('Analytics', 'التحليلات') },
        { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', alt: mc('Dashboard', 'لوحة التحكم') },
        { url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop', alt: mc('Planning', 'التخطيط') },
        { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop', alt: mc('Travel', 'السفر') },
        { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', alt: mc('E-commerce', 'التجارة الإلكترونية') },
        { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', alt: mc('Healthcare', 'الرعاية الصحية') },
      ],
    },
    {
      id: 'block-8',
      type: 'quote',
      content: mc(
        'This dashboard transformed how we manage our daily operations. The ROI was evident within the first month.',
        'لقد حولت هذه لوحة التحكم طريقة إدارتنا للعمليات اليومية. كان العائد على الاستثمار واضحاً خلال الشهر الأول.'
      ),
      author: mc('Sarah Anderson, Project Manager', 'سارة أندرسون، مدير المشروع'),
    },
    {
      id: 'block-9',
      type: 'divider',
      style: 'line',
    },
    {
      id: 'block-10',
      type: 'title',
      content: mc('Technical Implementation', 'التنفيذ التقني'),
      level: 2,
    },
    {
      id: 'block-11',
      type: 'richText',
      content: mc(
        'The application is built using React with TypeScript for type safety, TailwindCSS for styling, and Vite for fast development. State management is handled through React Context API, ensuring predictable state updates and easy debugging. The responsive design ensures compatibility across all modern browsers and devices.',
        'تم بناء التطبيق باستخدام React مع TypeScript للأمان النوعي، وTailwindCSS للتصميم، وVite للتطوير السريع.'
      ),
    },
    {
      id: 'block-12',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      caption: mcap('Project Demo Video', 'فيديو توضيحي للمشروع'),
    },
  ],

  'proj-002': [
    {
      id: 'block-1',
      type: 'title',
      content: mc('HealthTrack Mobile App', 'تطبيق HealthTrack للجوال'),
      level: 1,
    },
    {
      id: 'block-2',
      type: 'richText',
      content: mc(
        'HealthTrack is a cross-platform mobile application designed to help users monitor their health metrics, track fitness progress, and achieve their wellness goals. With an intuitive interface and powerful analytics, staying healthy has never been easier.',
        'HealthTrack هو تطبيق جوال عابر للمنصات مصمم لمساعدة المستخدمين على مراقبة مقاييس صحتهم وتتبع تقدم اللياقة البدنية.'
      ),
    },
    {
      id: 'block-3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
      alt: mc('Health App Interface', 'واجهة تطبيق الصحة'),
      caption: mcap('Health Tracking Dashboard', 'لوحة تتبع الصحة'),
    },
    {
      id: 'block-4',
      type: 'divider',
      style: 'dots',
    },
    {
      id: 'block-5',
      type: 'title',
      content: mc('App Features', 'ميزات التطبيق'),
      level: 2,
    },
    {
      id: 'block-6',
      type: 'richText',
      content: mc(
        'The app includes activity tracking, nutrition logging, sleep analysis, heart rate monitoring, and personalized workout recommendations. All data is synced securely to the cloud for access across devices.',
        'يتضمن التطبيق تتبع النشاط وتسجيل التغذية وتحليل النوم ومراقبة معدل ضربات القلب وتوصيات التمارين الشخصية.'
      ),
    },
    {
      id: 'block-7',
      type: 'quote',
      content: mc(
        'HealthTrack helped me lose 15 pounds in 3 months. The personalized recommendations made all the difference!',
        'ساعدني HealthTrack على فقدان 7 كيلو في 3 أشهر!'
      ),
      author: mc('Ahmed Hassan, User', 'أحمد حسن، مستخدم'),
    },
  ],

  'proj-003': [
    {
      id: 'block-1',
      type: 'title',
      content: mc('FinanceFlow SaaS Platform', 'منصة FinanceFlow السحابية'),
      level: 1,
    },
    {
      id: 'block-2',
      type: 'richText',
      content: mc(
        'FinanceFlow is an enterprise-grade financial management platform that provides real-time analytics, automated reporting, and comprehensive budgeting tools. Designed for CFOs and finance teams, it streamlines financial operations at scale.',
        'FinanceFlow هي منصة إدارة مالية على مستوى المؤسسات توفر تحليلات في الوقت الفعلي وتقارير آلية وأدوات ميزانية شاملة.'
      ),
    },
  ],
};

export const MOCK_PROJECT_CONTENT: Record<string, Block[]> = {};

// Get project content by project ID
export const getProjectContent = (projectId: string): Block[] => {
  return MOCK_PROJECT_CONTENT[projectId] || [];
};

// Get all available project IDs with content
export const getProjectIdsWithContent = (): string[] => {
  return Object.keys(MOCK_PROJECT_CONTENT);
};