// =====================================================
// CATEGORY CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 5B: Service Categories Management
// =====================================================

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storageHelpers';
import {
  ServiceCategory,
  CategoryStatus,
  createDefaultCategory,
} from '../types/project';

// Initial categories with multilingual support
const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-001',
    name: 'Web Development',
    nameAr: 'تطوير الويب',
    slug: 'web-development',
    description: 'Full-stack web development services including frontend and backend solutions.',
    descriptionAr: 'خدمات تطوير الويب كامل المكدس تشمل حلول الواجهة الأمامية والخلفية.',
    icon: 'Code',
    color: 'blue',
    status: 'active',
    order: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    serviceCount: 2,
  },
  {
    id: 'cat-002',
    name: 'Mobile Development',
    nameAr: 'تطوير تطبيقات الجوال',
    slug: 'mobile-development',
    description: 'Cross-platform mobile application development for iOS and Android.',
    descriptionAr: 'تطوير تطبيقات جوال عابرة للمنصات لـ iOS و Android.',
    icon: 'Smartphone',
    color: 'green',
    status: 'active',
    order: 2,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    serviceCount: 1,
  },
  {
    id: 'cat-003',
    name: 'UI/UX Design',
    nameAr: 'تصميم واجهات المستخدم',
    slug: 'ui-ux-design',
    description: 'User experience design and interface architecture for digital products.',
    descriptionAr: 'تصميم تجربة المستخدم وهندسة الواجهات للمنتجات الرقمية.',
    icon: 'Palette',
    color: 'purple',
    status: 'active',
    order: 3,
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    serviceCount: 1,
  },
  {
    id: 'cat-004',
    name: 'AI & Machine Learning',
    nameAr: 'الذكاء الاصطناعي وتعلم الآلة',
    slug: 'ai-machine-learning',
    description: 'Artificial intelligence and machine learning solutions for business automation.',
    descriptionAr: 'حلول الذكاء الاصطناعي وتعلم الآلة لأتمتة الأعمال.',
    icon: 'Brain',
    color: 'orange',
    status: 'active',
    order: 4,
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-04T10:00:00Z',
    serviceCount: 1,
  },
  {
    id: 'cat-005',
    name: 'Game Development',
    nameAr: 'تطوير الألعاب',
    slug: 'game-development',
    description: 'Interactive gaming experiences with Unity and Unreal Engine.',
    descriptionAr: 'تجارب ألعاب تفاعلية باستخدام Unity و Unreal Engine.',
    icon: 'Gamepad2',
    color: 'pink',
    status: 'active',
    order: 5,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    serviceCount: 1,
  },
  {
    id: 'cat-006',
    name: 'DevOps & Cloud',
    nameAr: 'DevOps والحوسبة السحابية',
    slug: 'devops-cloud',
    description: 'Cloud infrastructure, DevOps, and system architecture for scalable applications.',
    descriptionAr: 'البنية التحتية السحابية و DevOps وهندسة الأنظمة للتطبيقات القابلة للتوسع.',
    icon: 'Cloud',
    color: 'cyan',
    status: 'active',
    order: 6,
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-06T10:00:00Z',
    serviceCount: 1,
  },
  {
    id: 'cat-007',
    name: 'E-commerce',
    nameAr: 'التجارة الإلكترونية',
    slug: 'ecommerce',
    description: 'Complete e-commerce platforms with inventory management and payment integration.',
    descriptionAr: 'منصات التجارة الإلكترونية الكاملة مع إدارة المخزون ودمج الدفع.',
    icon: 'ShoppingCart',
    color: 'amber',
    status: 'inactive',
    order: 7,
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-07T10:00:00Z',
    serviceCount: 0,
  },
];

interface CategoryContextType {
  categories: ServiceCategory[];
  addCategory: (category: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => ServiceCategory | undefined;
  getCategoryBySlug: (slug: string) => ServiceCategory | undefined;
  getActiveCategories: () => ServiceCategory[];
  getCategoriesByIds: (ids: string[]) => ServiceCategory[];
  duplicateCategory: (id: string) => string | null;
  updateServiceCount: (categoryId: string, count: number) => void;
  isSlugTaken: (slug: string, excludeId?: string) => boolean;
  getNextOrder: () => number;
}

const CATEGORIES_STORAGE_KEY = 'axiomx_categories';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage<ServiceCategory[]>(CATEGORIES_STORAGE_KEY);
    if (stored && stored.length > 0) {
      setCategories(stored);
    } else {
      setCategories(INITIAL_CATEGORIES);
      saveToStorage(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && categories.length > 0) {
      saveToStorage(CATEGORIES_STORAGE_KEY, categories);
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback(
    (categoryData: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = `cat-${Date.now()}`;
      const now = new Date().toISOString();

      const newCategory: ServiceCategory = {
        ...categoryData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      setCategories((prev) => [newCategory, ...prev]);
      return id;
    },
    []
  );

  const updateCategory = useCallback((id: string, updates: Partial<ServiceCategory>) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== id) return category;

        return {
          ...category,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  }, []);

  const getCategory = useCallback(
    (id: string) => {
      return categories.find((category) => category.id === id);
    },
    [categories]
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => {
      return categories.find((category) => category.slug === slug);
    },
    [categories]
  );

  const getActiveCategories = useCallback(() => {
    return categories
      .filter((category) => category.status === 'active')
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  const getCategoriesByIds = useCallback(
    (ids: string[]) => {
      return categories.filter((category) => ids.includes(category.id));
    },
    [categories]
  );

  const duplicateCategory = useCallback((id: string) => {
    const originalCategory = categories.find((c) => c.id === id);
    if (!originalCategory) return null;

    const newId = `cat-${Date.now()}`;
    const now = new Date().toISOString();

    const duplicatedCategory: ServiceCategory = {
      ...originalCategory,
      id: newId,
      name: `${originalCategory.name} (Copy)`,
      nameAr: `${originalCategory.nameAr} (نسخة)`,
      slug: `${originalCategory.slug}-copy`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      serviceCount: 0,
    };

    setCategories((prev) => [duplicatedCategory, ...prev]);
    return newId;
  }, [categories]);

  const updateServiceCount = useCallback((categoryId: string, count: number) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          serviceCount: count,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const isSlugTaken = useCallback(
    (slug: string, excludeId?: string) => {
      const normalizedSlug = slug.toLowerCase().trim();
      return categories.some(
        (category) => category.id !== excludeId && category.slug.toLowerCase() === normalizedSlug
      );
    },
    [categories]
  );

  const getNextOrder = useCallback(() => {
    const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.order), 0);
    return maxOrder + 1;
  }, [categories]);

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategory,
      getCategoryBySlug,
      getActiveCategories,
      getCategoriesByIds,
      duplicateCategory,
      updateServiceCount,
      isSlugTaken,
      getNextOrder,
    }),
    [
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategory,
      getCategoryBySlug,
      getActiveCategories,
      getCategoriesByIds,
      duplicateCategory,
      updateServiceCount,
      isSlugTaken,
      getNextOrder,
    ]
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};