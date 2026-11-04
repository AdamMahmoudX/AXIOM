// =====================================================
// CATEGORIES LIST PAGE - AXIOMX ADMIN SYSTEM
// Phase 5B: Service Categories Management
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useCategories } from '../../../context/CategoryContext';
import { ServiceCategory, CATEGORY_STATUS_LABELS, CATEGORY_STATUS_COLORS } from '../../../types/project';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';

const CategoriesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { categories, deleteCategory, duplicateCategory } = useCategories();
  const isRTL = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameAr.includes(searchTerm) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirm(null);
    setOpenMenuId(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateCategory(id);
    setOpenMenuId(null);
  };

  const getStatusBadge = (status: ServiceCategory['status']) => {
    const colors = CATEGORY_STATUS_COLORS[status];
    const labels = CATEGORY_STATUS_LABELS[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {language === 'ar' ? labels.ar : labels.en}
      </span>
    );
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'ar' ? 'فئات الخدمات' : 'Service Categories'}
            </h1>
            <p className="text-gray-400">
              {language === 'ar'
                ? 'إدارة وتظيم فئات الخدمات المقدمة'
                : 'Manage and organize service categories'}
            </p>
          </div>
          <Link
            to="/admin/categories/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            {language === 'ar' ? 'إضافة فئة جديدة' : 'Add Category'}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في الفئات...' : 'Search categories...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
              isRTL ? 'text-right pr-10 pl-4' : 'text-left'
            }`}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
            <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {language === 'ar' ? 'عدد الخدمات' : 'Services'}
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {language === 'ar' ? 'الترتيب' : 'Order'}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Tag className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400">
                        {language === 'ar' ? 'لا توجد فئات' : 'No categories found'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(
                            category.color
                          )} border`}
                        >
                          <span className="text-sm font-bold">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {language === 'ar' ? category.nameAr : category.name}
                          </p>
                          <p className="text-sm text-gray-500">{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {getStatusBadge(category.status)}
                    </td>
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-white font-medium">{category.serviceCount || 0}</span>
                    </td>
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-white">{category.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {openMenuId === category.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 py-1">
                              <button
                                onClick={() => {
                                  navigate(`/admin/categories/edit/${category.id}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                {language === 'ar' ? 'تعديل' : 'Edit'}
                              </button>
                              <button
                                onClick={() => handleDuplicate(category.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                                {language === 'ar' ? 'نسخ' : 'Duplicate'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(category.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                {language === 'ar' ? 'حذف' : 'Delete'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {language === 'ar'
              ? `عرض ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredCategories.length)} من ${filteredCategories.length}`
              : `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredCategories.length)} of ${filteredCategories.length}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? <ChevronRight className="w-5 h-5 text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-400" />}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? <ChevronLeft className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
            </h3>
            <p className="text-gray-400 mb-6">
              {language === 'ar'
                ? 'هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this category? This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesListPage;