// =====================================================
// PROJECT CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Project,
  ProjectStatus,
  TranslationStatus,
  calculateTranslationStatus,
  LanguageContent,
} from '../types/project';
import { Block } from '../components/blocks/blockTypes';

// Create empty content structure
const createEmptyContent = (): LanguageContent => ({
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  seo: {
    title: '',
    description: '',
    ogTitle: '',
    ogDescription: '',
  },
  blocks: [] as Block[],
});

// Create default project data with multilingual support
const createDefaultProject = (id: string): Project => ({
  id,
  name: '',
  shortDescription: '',
  status: 'planning' as ProjectStatus,
  managerId: '',
  managerName: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: '',
  client: '',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  content: {
    en: createEmptyContent(),
    ar: createEmptyContent(),
  },
  translationStatus: {
    en: 'missing' as TranslationStatus,
    ar: 'missing' as TranslationStatus,
  },
});

// Initial mock projects with multilingual support
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'AXIOMX Admin Dashboard',
    shortDescription: 'Comprehensive admin dashboard with employee management, project tracking, and analytics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '2',
    managerName: 'Sarah Anderson',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
    category: 'Web Development',
    client: 'AXIOMX Internal',
    content: {
      en: {
        title: 'AXIOMX Admin Dashboard',
        slug: 'axiomx-admin-dashboard',
        excerpt: 'Comprehensive admin dashboard with employee management, project tracking, and analytics.',
        description: 'AXIOMX Admin Dashboard is a comprehensive solution designed for enterprise-level organizations. It provides real-time insights, employee management, and seamless project tracking capabilities.',
        seo: {
          title: 'AXIOMX Admin Dashboard | Enterprise Solution',
          description: 'Comprehensive admin dashboard for enterprise organizations.',
          ogTitle: 'AXIOMX Admin Dashboard',
          ogDescription: 'Enterprise-grade admin dashboard with real-time analytics.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'AXIOMX Admin Dashboard - Project Overview', ar: 'لوحة تحكم AXIOMX - نظرة عامة على المشروع' },
            level: 1,
          },
          {
            id: 'block-2',
            type: 'richText',
            content: {
              en: 'AXIOMX Admin Dashboard is a comprehensive solution designed for enterprise-level organizations. It provides real-time insights, employee management, and seamless project tracking capabilities. Built with modern web technologies, it ensures optimal performance and user experience across all devices.',
              ar: 'لوحة تحكم AXIOMX هي حل شامل مصمم للمنظمات على مستوى المؤسسات. يوفر رؤى في الوقت الفعلي وإدارة الموظفين وتتبع المشاريع بسلاسة.',
            },
          },
          {
            id: 'block-3',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
            alt: { en: 'Dashboard Interface', ar: 'واجهة لوحة التحكم' },
            caption: { en: 'Main Dashboard Interface', ar: 'واجهة لوحة التحكم الرئيسية' },
          },
          {
            id: 'block-4',
            type: 'divider',
            style: 'dots',
          },
          {
            id: 'block-5',
            type: 'title',
            content: { en: 'Key Features', ar: 'المميزات الرئيسية' },
            level: 2,
          },
          {
            id: 'block-6',
            type: 'richText',
            content: {
              en: 'Our dashboard includes powerful features that help organizations manage their workflows efficiently. From real-time analytics to automated reporting, every aspect has been carefully crafted.',
              ar: 'تتضمن لوحتنا ميزات قوية تساعد المنظمات على إدارة سير العمل بكفاءة. من التحليلات في الوقت الفعلي إلى التقارير الآلية.',
            },
          },
        ],
      },
      ar: {
        title: 'لوحة تحكم AXIOMX',
        slug: 'axiomx-admin-dashboard-ar',
        excerpt: 'لوحة تحكم شاملة لإدارة الموظفين وتتبع المشاريع والتحليلات.',
        description: 'لوحة تحكم AXIOMX هي حل شامل مصمم للمنظمات على مستوى المؤسسات. يوفر رؤى في الوقت الفعلي وإدارة الموظفين وتتبع المشاريع بسلاسة.',
        seo: {
          title: 'لوحة تحكم AXIOMX | حل للمؤسسات',
          description: 'لوحة تحكم شاملة للمنظمات على مستوى المؤسسات.',
          ogTitle: 'لوحة تحكم AXIOMX',
          ogDescription: 'لوحة تحكم للمؤسسات مع تحليلات في الوقت الفعلي.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'AXIOMX Admin Dashboard', ar: 'لوحة تحكم AXIOMX - نظرة عامة على المشروع' },
            level: 1,
          },
          {
            id: 'block-2-ar',
            type: 'richText',
            content: {
              en: 'Comprehensive admin dashboard...',
              ar: 'لوحة تحكم AXIOMX هي حل شامل مصمم للمنظمات على مستوى المؤسسات. يوفر رؤى في الوقت الفعلي وإدارة الموظفين وتتبع المشاريع بسلاسة.',
            },
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'needs_review',
    },
  },
  {
    id: 'proj-002',
    name: 'HealthTrack Mobile App',
    shortDescription: 'Cross-platform mobile application for health monitoring and fitness tracking.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    status: 'completed',
    managerId: '3',
    managerName: 'Ahmed Hassan',
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
    category: 'Mobile App',
    client: 'HealthTech Solutions',
    content: {
      en: {
        title: 'HealthTrack Mobile App',
        slug: 'healthtrack-mobile-app',
        excerpt: 'Cross-platform mobile application for health monitoring and fitness tracking.',
        description: 'HealthTrack is a cross-platform mobile application designed to help users monitor their health metrics, track fitness progress, and achieve their wellness goals.',
        seo: {
          title: 'HealthTrack Mobile App | Fitness Tracking',
          description: 'Cross-platform health monitoring application.',
          ogTitle: 'HealthTrack Mobile App',
          ogDescription: 'Health and fitness tracking mobile application.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'HealthTrack Mobile App', ar: 'تطبيق HealthTrack للجوال' },
            level: 1,
          },
          {
            id: 'block-2',
            type: 'richText',
            content: {
              en: 'HealthTrack is a cross-platform mobile application designed to help users monitor their health metrics, track fitness progress, and achieve their wellness goals.',
              ar: 'HealthTrack هو تطبيق جوال عابر للمنصات مصمم لمساعدة المستخدمين على مراقبة مقاييس صحتهم وتتبع تقدم اللياقة البدنية.',
            },
          },
        ],
      },
      ar: {
        title: 'تطبيق HealthTrack للجوال',
        slug: 'healthtrack-mobile-app-ar',
        excerpt: 'تطبيق جوال عابر للمنصات لرصد الصحة وتتبع اللياقة البدنية.',
        description: 'HealthTrack هو تطبيق جوال عابر للمنصات مصمم لمساعدة المستخدمين على مراقبة مقاييس صحتهم وتتبع تقدم اللياقة البدنية.',
        seo: {
          title: 'تطبيق HealthTrack للجوال | تتبع اللياقة',
          description: 'تطبيق جوال لرصد الصحة عبر المنصات.',
          ogTitle: 'تطبيق HealthTrack للجوال',
          ogDescription: 'تطبيق جوال لرصد الصحة واللياقة البدنية.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'HealthTrack Mobile App', ar: 'تطبيق HealthTrack للجوال' },
            level: 1,
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'proj-003',
    name: 'FinanceFlow SaaS Platform',
    shortDescription: 'Enterprise financial management system with real-time analytics and reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '2',
    managerName: 'Sarah Anderson',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-06-05T09:15:00Z',
    category: 'SaaS Platform',
    client: 'FinanceFlow Inc.',
    content: {
      en: {
        title: 'FinanceFlow SaaS Platform',
        slug: 'financeflow-saas-platform',
        excerpt: 'Enterprise financial management system with real-time analytics and reporting.',
        description: 'FinanceFlow is an enterprise-grade financial management platform that provides real-time analytics, automated reporting, and comprehensive budgeting tools.',
        seo: {
          title: 'FinanceFlow SaaS Platform | Financial Management',
          description: 'Enterprise financial management solution.',
          ogTitle: 'FinanceFlow SaaS Platform',
          ogDescription: 'Enterprise-grade financial management platform.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'FinanceFlow SaaS Platform', ar: 'منصة FinanceFlow السحابية' },
            level: 1,
          },
        ],
      },
      ar: {
        title: 'منصة FinanceFlow السحابية',
        slug: 'financeflow-saas-platform-ar',
        excerpt: 'نظام إدارة مالية للمؤسسات مع تحليلات في الوقت الفعلي والتقارير.',
        description: 'FinanceFlow هي منصة إدارة مالية على مستوى المؤسسات توفر تحليلات في الوقت الفعلي وتقارير آلية وأدوات ميزانية شاملة.',
        seo: {
          title: 'منصة FinanceFlow السحابية | الإدارة المالية',
          description: 'حل إدارة مالية للمؤسسات.',
          ogTitle: 'منصة FinanceFlow السحابية',
          ogDescription: 'منصة إدارة مالية على مستوى المؤسسات.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'FinanceFlow SaaS Platform', ar: 'منصة FinanceFlow السحابية' },
            level: 1,
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'proj-004',
    name: 'EduLearn Platform',
    shortDescription: 'Interactive e-learning platform with AI-powered personalized learning paths.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '5',
    managerName: 'Fatima Al-Rashid',
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2024-06-03T11:20:00Z',
    category: 'AI/ML',
    client: 'EduLearn Corp',
    content: {
      en: {
        title: 'EduLearn Platform',
        slug: 'edulearn-platform',
        excerpt: 'Interactive e-learning platform with AI-powered personalized learning paths.',
        description: 'EduLearn is an AI-powered e-learning platform that creates personalized learning paths for each student.',
        seo: {
          title: 'EduLearn Platform | AI-Powered Learning',
          description: 'AI-powered e-learning platform.',
          ogTitle: 'EduLearn Platform',
          ogDescription: 'Interactive e-learning with AI.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'EduLearn Platform', ar: 'منصة EduLearn' },
            level: 1,
          },
        ],
      },
      ar: {
        title: 'منصة EduLearn',
        slug: 'edulearn-platform-ar',
        excerpt: 'منصة تعلم إلكتروني تفاعلية مع مسارات تعلم مخصصة مدعومة بالذكاء الاصطناعي.',
        description: 'EduLearn هي منصة تعلم إلكتروني مدعومة بالذكاء الاصطناعي تنشئ مسارات تعلم مخصصة لكل طالب.',
        seo: {
          title: 'منصة EduLearn | تعلم مدعوم بالذكاء الاصطناعي',
          description: 'منصة تعلم إلكتروني مدعومة بالذكاء الاصطناعي.',
          ogTitle: 'منصة EduLearn',
          ogDescription: 'تعلم تفاعلي مع الذكاء الاصطناعي.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'EduLearn Platform', ar: 'منصة EduLearn' },
            level: 1,
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'proj-005',
    name: 'RetailMax E-commerce',
    shortDescription: 'Modern e-commerce solution with inventory management and multi-channel integration.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    status: 'completed',
    managerId: '3',
    managerName: 'Ahmed Hassan',
    createdAt: '2023-09-15T14:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    category: 'E-commerce',
    client: 'RetailMax Group',
    content: {
      en: {
        title: 'RetailMax E-commerce Solution',
        slug: 'retailmax-ecommerce',
        excerpt: 'Modern e-commerce solution with inventory management and multi-channel integration.',
        description: 'RetailMax is a complete e-commerce solution featuring inventory management, multi-channel selling, customer relationship management, and advanced analytics.',
        seo: {
          title: 'RetailMax E-commerce | Complete Solution',
          description: 'Modern e-commerce solution.',
          ogTitle: 'RetailMax E-commerce Solution',
          ogDescription: 'Complete e-commerce platform.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'RetailMax E-commerce Solution', ar: 'حل RetailMax للتجارة الإلكترونية' },
            level: 1,
          },
        ],
      },
      ar: {
        title: 'حل RetailMax للتجارة الإلكترونية',
        slug: 'retailmax-ecommerce-ar',
        excerpt: 'حل تجارة إلكترونية حديث مع إدارة المخزون وتكامل متعدد القنوات.',
        description: 'RetailMax هو حل تجارة إلكترونية كامل يتضمن إدارة المخزون والبيع متعدد القنوات وإدارة علاقات العملاء والتحليلات المتقدمة.',
        seo: {
          title: 'RetailMax للتجارة الإلكترونية | حل كامل',
          description: 'حل تجارة إلكترونية حديث.',
          ogTitle: 'حل RetailMax للتجارة الإلكترونية',
          ogDescription: 'منصة تجارة إلكترونية كاملة.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'RetailMax E-commerce Solution', ar: 'حل RetailMax للتجارة الإلكترونية' },
            level: 1,
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
];

// Additional projects to reach 15 total
const additionalProjects: Project[] = [
  {
    id: 'proj-006',
    name: 'SmartHome IoT System',
    shortDescription: 'Complete IoT ecosystem for smart home automation with mobile control.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop',
    status: 'on_hold',
    managerId: '4',
    managerName: 'Mohammed Al-Sayed',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-04-12T15:00:00Z',
    category: 'Web Development',
    client: 'SmartHome Technologies',
    content: {
      en: {
        title: 'SmartHome IoT System',
        slug: 'smarthome-iot-system',
        excerpt: 'Complete IoT ecosystem for smart home automation.',
        description: 'Complete IoT ecosystem for smart home automation with mobile control.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-007',
    name: 'CryptoTrack Wallet',
    shortDescription: 'Secure cryptocurrency wallet with portfolio tracking and exchange integration.',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop',
    status: 'planning',
    managerId: '2',
    managerName: 'Sarah Anderson',
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2024-06-04T12:00:00Z',
    category: 'Web Development',
    client: 'CryptoTech Labs',
    content: {
      en: {
        title: 'CryptoTrack Wallet',
        slug: 'cryptotrack-wallet',
        excerpt: 'Secure cryptocurrency wallet with portfolio tracking.',
        description: 'Secure cryptocurrency wallet with portfolio tracking and exchange integration.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-008',
    name: 'TravelEase App',
    shortDescription: 'Travel planning application with itinerary management and local recommendations.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '5',
    managerName: 'Fatima Al-Rashid',
    createdAt: '2024-04-01T11:30:00Z',
    updatedAt: '2024-06-02T14:15:00Z',
    category: 'Mobile App',
    client: 'TravelEase Inc.',
    content: {
      en: {
        title: 'TravelEase App',
        slug: 'travelease-app',
        excerpt: 'Travel planning application with itinerary management.',
        description: 'Travel planning application with itinerary management and local recommendations.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-009',
    name: 'HRConnect Portal',
    shortDescription: 'Comprehensive HR management system with employee self-service capabilities.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
    status: 'completed',
    managerId: '3',
    managerName: 'Ahmed Hassan',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2023-12-20T16:00:00Z',
    category: 'Web Development',
    client: 'HRConnect Solutions',
    content: {
      en: {
        title: 'HRConnect Portal',
        slug: 'hrconnect-portal',
        excerpt: 'Comprehensive HR management system.',
        description: 'Comprehensive HR management system with employee self-service capabilities.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-010',
    name: 'GameArena Platform',
    shortDescription: 'Multiplayer gaming platform with tournament management and leaderboards.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965c4?w=400&h=300&fit=crop',
    status: 'planning',
    managerId: '4',
    managerName: 'Mohammed Al-Sayed',
    createdAt: '2024-05-25T15:00:00Z',
    updatedAt: '2024-06-05T10:30:00Z',
    category: 'Game Development',
    client: 'GameArena Studios',
    content: {
      en: {
        title: 'GameArena Platform',
        slug: 'gamearena-platform',
        excerpt: 'Multiplayer gaming platform with tournament management.',
        description: 'Multiplayer gaming platform with tournament management and leaderboards.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-011',
    name: 'MediCare Portal',
    shortDescription: 'Healthcare portal for patient management, appointments, and medical records.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '5',
    managerName: 'Fatima Al-Rashid',
    createdAt: '2024-02-28T09:00:00Z',
    updatedAt: '2024-06-01T11:45:00Z',
    category: 'Web Development',
    client: 'MediCare Systems',
    content: {
      en: {
        title: 'MediCare Portal',
        slug: 'medicare-portal',
        excerpt: 'Healthcare portal for patient management.',
        description: 'Healthcare portal for patient management, appointments, and medical records.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-012',
    name: 'LogisticsPro Tracker',
    shortDescription: 'Real-time logistics tracking system with fleet management and analytics.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    status: 'cancelled',
    managerId: '4',
    managerName: 'Mohammed Al-Sayed',
    createdAt: '2023-10-15T14:00:00Z',
    updatedAt: '2024-02-10T09:30:00Z',
    category: 'Web Development',
    client: 'LogisticsPro Corp',
    content: {
      en: {
        title: 'LogisticsPro Tracker',
        slug: 'logisticspro-tracker',
        excerpt: 'Real-time logistics tracking system.',
        description: 'Real-time logistics tracking system with fleet management and analytics.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-013',
    name: 'FitLife Dashboard',
    shortDescription: 'Fitness tracking dashboard with workout planning and nutrition monitoring.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    status: 'completed',
    managerId: '3',
    managerName: 'Ahmed Hassan',
    createdAt: '2023-07-01T10:00:00Z',
    updatedAt: '2023-11-15T14:00:00Z',
    category: 'Web Development',
    client: 'FitLife Wellness',
    content: {
      en: {
        title: 'FitLife Dashboard',
        slug: 'fitlife-dashboard',
        excerpt: 'Fitness tracking dashboard with workout planning.',
        description: 'Fitness tracking dashboard with workout planning and nutrition monitoring.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-014',
    name: 'RealEstate Hub',
    shortDescription: 'Property listing platform with virtual tours and mortgage calculator.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    status: 'in_progress',
    managerId: '2',
    managerName: 'Sarah Anderson',
    createdAt: '2024-04-15T08:00:00Z',
    updatedAt: '2024-06-04T16:30:00Z',
    category: 'Web Development',
    client: 'RealEstate Hub LLC',
    content: {
      en: {
        title: 'RealEstate Hub',
        slug: 'realestate-hub',
        excerpt: 'Property listing platform with virtual tours.',
        description: 'Property listing platform with virtual tours and mortgage calculator.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'proj-015',
    name: 'FoodDelivery App',
    shortDescription: 'On-demand food delivery platform with real-time order tracking.',
    image: 'https://images.unsplash.com/photo-1565299624946-f28b7dc8b749?w=400&h=300&fit=crop',
    status: 'on_hold',
    managerId: '5',
    managerName: 'Fatima Al-Rashid',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-05-20T15:00:00Z',
    category: 'Mobile App',
    client: 'FoodHub Services',
    content: {
      en: {
        title: 'FoodDelivery App',
        slug: 'fooddelivery-app',
        excerpt: 'On-demand food delivery platform.',
        description: 'On-demand food delivery platform with real-time order tracking.',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
];

// Merge all projects
const ALL_PROJECTS = [...INITIAL_PROJECTS, ...additionalProjects];

interface ProjectContextType {
  projects: Project[];
  addProject: (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
  ) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  getProjectBySlug: (slug: string, language: 'en' | 'ar') => Project | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  updateProjectContent: (
    id: string,
    language: 'en' | 'ar',
    content: Partial<LanguageContent>
  ) => void;
  duplicateProjectContent: (
    id: string,
    fromLang: 'en' | 'ar',
    toLang: 'en' | 'ar'
  ) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(ALL_PROJECTS);

  const addProject = useCallback(
    (
      projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      const id = `proj-${Date.now()}`;
      const now = new Date().toISOString();

      const newProject: Project = {
        ...projectData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      setProjects((prev) => [newProject, ...prev]);
      return id;
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== id) return project;

        const updatedProject = {
          ...project,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // Recalculate translation status if content was updated
        if (updates.content) {
          updatedProject.translationStatus = {
            en: calculateTranslationStatus(updates.content.en || project.content.en),
            ar: calculateTranslationStatus(updates.content.ar || project.content.ar),
          };
        }

        return updatedProject;
      })
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }, []);

  const getProject = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects]
  );

  const getProjectBySlug = useCallback(
    (slug: string, language: 'en' | 'ar') => {
      return projects.find((project) => project.content[language].slug === slug);
    },
    [projects]
  );

  const getProjectsByStatus = useCallback(
    (status: ProjectStatus) => {
      return projects.filter((project) => project.status === status);
    },
    [projects]
  );

  const updateProjectContent = useCallback(
    (id: string, language: 'en' | 'ar', contentUpdates: Partial<LanguageContent>) => {
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id !== id) return project;

          const updatedContent = {
            ...project.content[language],
            ...contentUpdates,
          };

          return {
            ...project,
            content: {
              ...project.content,
              [language]: updatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...project.translationStatus,
              [language]: calculateTranslationStatus(updatedContent),
            },
          };
        })
      );
    },
    []
  );

  const duplicateProjectContent = useCallback(
    (id: string, fromLang: 'en' | 'ar', toLang: 'en' | 'ar') => {
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id !== id) return project;

          const sourceContent = project.content[fromLang];
          const duplicatedContent: LanguageContent = {
            ...sourceContent,
            blocks: sourceContent.blocks.map((block) => ({
              ...block,
              id: `${block.id}-dup-${Date.now()}`,
            })),
          };

          return {
            ...project,
            content: {
              ...project.content,
              [toLang]: duplicatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...project.translationStatus,
              [toLang]: calculateTranslationStatus(duplicatedContent),
            },
          };
        })
      );
    },
    []
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        getProjectBySlug,
        getProjectsByStatus,
        updateProjectContent,
        duplicateProjectContent,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};