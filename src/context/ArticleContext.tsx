// =====================================================
// ARTICLE CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Article, ArticleStatus, TranslationStatus, calculateTranslationStatus } from '../types/project';
import { Block } from '../components/blocks/blockTypes';

// Default empty content structure
const createEmptyContent = () => ({
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

// Default article data
const createDefaultArticle = (id: string, authorId: string, authorName: string): Article => ({
  id,
  title: '',
  excerpt: '',
  status: 'draft',
  author: authorName,
  authorId,
  authorName,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: 'Technology',
  tags: [],
  readTime: 5,
  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
  featured: false,
  content: {
    en: createEmptyContent(),
    ar: createEmptyContent(),
  },
  translationStatus: {
    en: 'missing',
    ar: 'missing',
  },
});

// Initial mock articles with multilingual support
const INITIAL_ARTICLES: Article[] = [
  {
    id: 'article-001',
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is transforming the landscape of web development and what developers need to know.',
    status: 'published' as ArticleStatus,
    author: 'John Smith',
    authorId: '1',
    authorName: 'John Smith',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Future'],
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    featured: true,
    content: {
      en: {
        title: 'The Future of AI in Web Development',
        slug: 'future-of-ai-web-development',
        excerpt: 'Exploring how artificial intelligence is transforming the landscape of web development and what developers need to know.',
        description: 'Artificial intelligence is revolutionizing web development in unprecedented ways. From automated code generation to intelligent user experience design, AI tools are becoming indispensable for modern developers. This article explores the current state of AI in web development and what the future holds.',
        seo: {
          title: 'The Future of AI in Web Development | AXIOMX',
          description: 'Discover how AI is transforming web development and what it means for developers.',
          ogTitle: 'The Future of AI in Web Development',
          ogDescription: 'Exploring how artificial intelligence is transforming web development.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'The Future of AI in Web Development', ar: 'مستقبل الذكاء الاصطناعي في تطوير الويب' },
            level: 1,
          },
          {
            id: 'block-2',
            type: 'richText',
            content: {
              en: 'Artificial intelligence is revolutionizing web development in unprecedented ways. From automated code generation to intelligent user experience design, AI tools are becoming indispensable for modern developers.',
              ar: 'يشهد تطوير الويب ثورة غير مسبوقة بفضل الذكاء الاصطناعي. من توليد الشيفرة الآلي إلى تصميم تجربة المستخدم الذكية، أصبحت أدوات الذكاء الاصطناعي لا غنى عنها للمطورين المعاصرين.',
            },
          },
          {
            id: 'block-3',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
            alt: { en: 'AI in Web Development', ar: 'الذكاء الاصطناعي في تطوير الويب' },
            caption: { en: 'AI transforming web development', ar: 'الذكاء الاصطناعي يحول تطوير الويب' },
          },
        ],
      },
      ar: {
        title: 'مستقبل الذكاء الاصطناعي في تطوير الويب',
        slug: 'future-of-ai-web-development-ar',
        excerpt: 'استكشاف كيف يغير الذكاء الاصطناعي مشهد تطوير الويب وما يحتاج المطورون لمعرفته.',
        description: 'يشهد تطوير الويب ثورة غير مسبوقة بفضل الذكاء الاصطناعي. من توليد الشيفرة الآلي إلى تصميم تجربة المستخدم الذكية، أصبحت أدوات الذكاء الاصطناعي لا غنى عنها للمطورين المعاصرين. تستكشف هذه المقالة الحالة الحالية للذكاء الاصطناعي في تطوير الويب وما يحمله المستقبل.',
        seo: {
          title: 'مستقبل الذكاء الاصطناعي في تطوير الويب | AXIOMX',
          description: 'اكتشف كيف يغير الذكاء الاصطناعي تطوير الويب وما يعنيه للمطورين.',
          ogTitle: 'مستقبل الذكاء الاصطناعي في تطوير الويب',
          ogDescription: 'استكشاف كيف يغير الذكاء الاصطناعي تطوير الويب.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'The Future of AI in Web Development', ar: 'مستقبل الذكاء الاصطناعي في تطوير الويب' },
            level: 1,
          },
          {
            id: 'block-2-ar',
            type: 'richText',
            content: {
              en: 'Artificial intelligence is revolutionizing web development in unprecedented ways.',
              ar: 'يشهد تطوير الويب ثورة غير مسبوقة بفضل الذكاء الاصطناعي. من توليد الشيفرة الآلي إلى تصميم تجربة المستخدم الذكية، أصبحت أدوات الذكاء الاصطناعي لا غنى عنها للمطورين المعاصرين.',
            },
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
    id: 'article-002',
    title: 'Designing for the Next Generation',
    excerpt: 'A comprehensive guide to creating user interfaces that will dominate the next decade of digital experiences.',
    status: 'published' as ArticleStatus,
    author: 'Sarah Anderson',
    authorId: '2',
    authorName: 'Sarah Anderson',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-06-05T16:45:00Z',
    category: 'Design',
    tags: ['UI', 'UX', 'Design Systems'],
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    featured: true,
    content: {
      en: {
        title: 'Designing for the Next Generation',
        slug: 'designing-next-generation',
        excerpt: 'A comprehensive guide to creating user interfaces that will dominate the next decade of digital experiences.',
        description: 'The landscape of user interface design is evolving rapidly. With new technologies emerging and user expectations changing, designers need to adapt their approach to create interfaces that will stand the test of time.',
        seo: {
          title: 'Designing for the Next Generation | AXIOMX',
          description: 'A comprehensive guide to creating future-proof user interfaces.',
          ogTitle: 'Designing for the Next Generation',
          ogDescription: 'A comprehensive guide to creating user interfaces for the future.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'Designing for the Next Generation', ar: 'التصميم للجيل القادم' },
            level: 1,
          },
          {
            id: 'block-2',
            type: 'richText',
            content: {
              en: 'The landscape of user interface design is evolving rapidly. With new technologies emerging and user expectations changing, designers need to adapt their approach.',
              ar: 'يتطور مشهد تصميم واجهات المستخدم بسرعة. مع ظهور تقنيات جديدة وتغير توقعات المستخدمين، يحتاج المصممون إلى تكييف نهجهم.',
            },
          },
        ],
      },
      ar: {
        title: 'التصميم للجيل القادم',
        slug: 'designing-next-generation-ar',
        excerpt: 'دليل شامل لإنشاء واجهات مستخدم ستسيطر على العقد القادم من التجارب الرقمية.',
        description: 'يتطور مشهد تصميم واجهات المستخدم بسرعة. مع ظهور تقنيات جديدة وتغير توقعات المستخدمين، يحتاج المصممون إلى تكييف نهجهم لإنشاء واجهات تقف أمام اختبار الزمن.',
        seo: {
          title: 'التصميم للجيل القادم | AXIOMX',
          description: 'دليل شامل لإنشاء واجهات مستخدم مستقبلية.',
          ogTitle: 'التصميم للجيل القادم',
          ogDescription: 'دليل شامل لإنشاء واجهات مستخدم للمستقبل.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'Designing for the Next Generation', ar: 'التصميم للجيل القادم' },
            level: 1,
          },
          {
            id: 'block-2-ar',
            type: 'richText',
            content: {
              en: 'The landscape of user interface design is evolving rapidly.',
              ar: 'يتطور مشهد تصميم واجهات المستخدم بسرعة. مع ظهور تقنيات جديدة وتغير توقعات المستخدمين، يحتاج المصممون إلى تكييف نهجهم.',
            },
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
    id: 'article-003',
    title: 'Cloud-Native Architecture Best Practices',
    excerpt: 'Learn the essential principles and practices for building scalable, resilient cloud-native applications.',
    status: 'published' as ArticleStatus,
    author: 'Ahmed Hassan',
    authorId: '3',
    authorName: 'Ahmed Hassan',
    createdAt: '2024-03-10T11:30:00Z',
    updatedAt: '2024-06-03T10:15:00Z',
    category: 'Architecture',
    tags: ['Cloud', 'Microservices', 'DevOps'],
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    featured: false,
    content: {
      en: {
        title: 'Cloud-Native Architecture Best Practices',
        slug: 'cloud-native-architecture',
        excerpt: 'Learn the essential principles and practices for building scalable, resilient cloud-native applications.',
        description: 'Cloud-native architecture has become the standard for modern application development. This comprehensive guide covers everything from microservices design patterns to container orchestration.',
        seo: {
          title: 'Cloud-Native Architecture Best Practices | AXIOMX',
          description: 'Learn the essential principles for building cloud-native applications.',
          ogTitle: 'Cloud-Native Architecture Best Practices',
          ogDescription: 'Essential principles for cloud-native application development.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'Cloud-Native Architecture Best Practices', ar: 'أفضل ممارسات البنية السحابية' },
            level: 1,
          },
        ],
      },
      ar: {
        title: 'أفضل ممارسات البنية السحابية',
        slug: 'cloud-native-architecture-ar',
        excerpt: 'تعلم المبادئ الأساسية والممارسات لبناء تطبيقات سحابية قابلة للتوسع وموثوقة.',
        description: 'أصبحت البنية السحابية المعيار لتطوير التطبيقات الحديثة. يغطي هذا الدليل الشامل كل شيء من أنماط تصميم الخدمات المصغرة إلى تنسيق الحاويات.',
        seo: {
          title: 'أفضل ممارسات البنية السحابية | AXIOMX',
          description: 'تعلم المبادئ الأساسية لبناء التطبيقات السحابية.',
          ogTitle: 'أفضل ممارسات البنية السحابية',
          ogDescription: 'مبادئ أساسية لتطوير التطبيقات السحابية.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'Cloud-Native Architecture Best Practices', ar: 'أفضل ممارسات البنية السحابية' },
            level: 1,
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
    id: 'article-004',
    title: 'Cybersecurity Basics for Modern Web',
    excerpt: 'Understanding the fundamental security practices every web developer should implement.',
    status: 'draft' as ArticleStatus,
    author: 'John Smith',
    authorId: '1',
    authorName: 'John Smith',
    createdAt: '2024-04-05T08:00:00Z',
    updatedAt: '2024-06-04T12:30:00Z',
    category: 'Security',
    tags: ['Cybersecurity', 'Web Security', 'Protection'],
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
    featured: false,
    content: {
      en: {
        title: 'Cybersecurity Basics for Modern Web',
        slug: 'cybersecurity-basics-modern-web',
        excerpt: 'Understanding the fundamental security practices every web developer should implement.',
        description: 'Web security is more important than ever. This article covers the essential security practices that every web developer should implement to protect their applications and users.',
        seo: {
          title: 'Cybersecurity Basics for Modern Web | AXIOMX',
          description: 'Essential security practices for web developers.',
          ogTitle: 'Cybersecurity Basics for Modern Web',
          ogDescription: 'Understanding fundamental security practices for the web.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'Cybersecurity Basics for Modern Web', ar: 'أساسيات الأمن السيبراني للويب الحديث' },
            level: 1,
          },
        ],
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
    id: 'article-005',
    title: 'React Framework Deep Dive',
    excerpt: 'An in-depth exploration of React features and best practices for building modern applications.',
    status: 'published' as ArticleStatus,
    author: 'Sarah Anderson',
    authorId: '2',
    authorName: 'Sarah Anderson',
    createdAt: '2024-05-12T14:00:00Z',
    updatedAt: '2024-06-02T09:45:00Z',
    category: 'Technology',
    tags: ['React', 'Frontend', 'JavaScript'],
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    featured: true,
    content: {
      en: {
        title: 'React Framework Deep Dive',
        slug: 'react-framework-deep-dive',
        excerpt: 'An in-depth exploration of React features and best practices for building modern applications.',
        description: 'React has become the go-to framework for building modern web applications. This comprehensive guide takes you through advanced concepts and best practices.',
        seo: {
          title: 'React Framework Deep Dive | AXIOMX',
          description: 'In-depth exploration of React features and best practices.',
          ogTitle: 'React Framework Deep Dive',
          ogDescription: 'Advanced React concepts and best practices.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'React Framework Deep Dive', ar: 'غوص عميق في إطار عمل React' },
            level: 1,
          },
        ],
      },
      ar: {
        title: 'غوص عميق في إطار عمل React',
        slug: 'react-framework-deep-dive-ar',
        excerpt: 'استكشاف متعمق لميزات React وأفضل الممارسات لبناء التطبيقات الحديثة.',
        description: 'أصبح React الإطار المفضل لبناء تطبيقات الويب الحديثة. يأخذك هذا الدليل الشامل عبر المفاهيم المتقدمة وأفضل الممارسات.',
        seo: {
          title: 'غوص عميق في إطار عمل React | AXIOMX',
          description: 'استكشاف متعمق لميزات React وأفضل الممارسات.',
          ogTitle: 'غوص عميق في إطار عمل React',
          ogDescription: 'مفاهيم React المتقدمة وأفضل الممارسات.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'React Framework Deep Dive', ar: 'غوص عميق في إطار عمل React' },
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

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'translationStatus'>) => string;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  getArticleBySlug: (slug: string, language: 'en' | 'ar') => Article | undefined;
  getArticlesByCategory: (category: string) => Article[];
  getFeaturedArticles: () => Article[];
  updateArticleContent: (
    id: string,
    language: 'en' | 'ar',
    content: Partial<Article['content']['en']>
  ) => void;
  duplicateContent: (
    id: string,
    fromLang: 'en' | 'ar',
    toLang: 'en' | 'ar'
  ) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const addArticle = useCallback(
    (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'translationStatus'>) => {
      const id = `article-${Date.now()}`;
      const now = new Date().toISOString();
      const newArticle: Article = {
        ...articleData,
        id,
        createdAt: now,
        updatedAt: now,
        translationStatus: {
          en: calculateTranslationStatus(articleData.content.en),
          ar: calculateTranslationStatus(articleData.content.ar),
        },
      };
      setArticles((prev) => [newArticle, ...prev]);
      return id;
    },
    []
  );

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? {
              ...article,
              ...updates,
              updatedAt: new Date().toISOString(),
              translationStatus: {
                en: updates.content?.en
                  ? calculateTranslationStatus({ ...article.content.en, ...updates.content.en })
                  : article.translationStatus.en,
                ar: updates.content?.ar
                  ? calculateTranslationStatus({ ...article.content.ar, ...updates.content.ar })
                  : article.translationStatus.ar,
              },
            }
          : article
      )
    );
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  }, []);

  const getArticle = useCallback(
    (id: string) => {
      return articles.find((article) => article.id === id);
    },
    [articles]
  );

  const getArticleBySlug = useCallback(
    (slug: string, language: 'en' | 'ar') => {
      return articles.find((article) => article.content[language].slug === slug);
    },
    [articles]
  );

  const getArticlesByCategory = useCallback(
    (category: string) => {
      return articles.filter((article) => article.category === category);
    },
    [articles]
  );

  const getFeaturedArticles = useCallback(() => {
    return articles.filter((article) => article.featured);
  }, [articles]);

  const updateArticleContent = useCallback(
    (id: string, language: 'en' | 'ar', contentUpdates: Partial<Article['content']['en']>) => {
      setArticles((prev) =>
        prev.map((article) => {
          if (article.id !== id) return article;

          const updatedContent = {
            ...article.content[language],
            ...contentUpdates,
          };

          return {
            ...article,
            content: {
              ...article.content,
              [language]: updatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...article.translationStatus,
              [language]: calculateTranslationStatus(updatedContent),
            },
          };
        })
      );
    },
    []
  );

  const duplicateContent = useCallback(
    (id: string, fromLang: 'en' | 'ar', toLang: 'en' | 'ar') => {
      setArticles((prev) =>
        prev.map((article) => {
          if (article.id !== id) return article;

          const sourceContent = article.content[fromLang];
          const duplicatedContent: Article['content']['en'] = {
            ...sourceContent,
          };

          // Duplicate blocks
          const duplicatedBlocks = sourceContent.blocks.map((block) => {
            const newBlock = { ...block, id: `${block.id}-dup-${Date.now()}` };
            // Note: In a real implementation, we would use the duplicateBlockContent function
            return newBlock;
          });

          duplicatedContent.blocks = duplicatedBlocks;

          return {
            ...article,
            content: {
              ...article.content,
              [toLang]: duplicatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...article.translationStatus,
              [toLang]: calculateTranslationStatus(duplicatedContent),
            },
          };
        })
      );
    },
    []
  );

  return (
    <ArticleContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticle,
        getArticleBySlug,
        getArticlesByCategory,
        getFeaturedArticles,
        updateArticleContent,
        duplicateContent,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};