import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Mail,
  Search,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Phone,
  Link2,
  Lightbulb,
  Inbox,
} from 'lucide-react';
import {
  CLIENT_REQUESTS_STORAGE_KEY,
  loadClientRequests,
  saveClientRequests,
} from '../../../utils/clientRequestsStorage';

interface ClientRequest {
  id: string;
  name: string;
  phone: string;
  socialLink: string;
  projectType: string;
  idea: string;
  timestamp: string;
  read?: boolean;
}

const normalizeRequest = (raw: Partial<ClientRequest>, index: number): ClientRequest => ({
  id: raw.id || `req-${index}-${raw.timestamp || Date.now()}`,
  name: raw.name || '',
  phone: raw.phone || '',
  socialLink: raw.socialLink || '',
  projectType: raw.projectType || 'other',
  idea: raw.idea || '',
  timestamp: typeof raw.timestamp === 'string'
    ? raw.timestamp
    : new Date(raw.timestamp as unknown as string | number).toISOString(),
  read: raw.read ?? false,
});

const loadRequests = (): ClientRequest[] => {
  return loadClientRequests<Partial<ClientRequest>>().map(normalizeRequest);
};

const saveRequests = (requests: ClientRequest[]) => {
  saveClientRequests(requests);
};

const MessagesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refreshRequests = useCallback(() => {
    setRequests(loadRequests());
  }, []);

  useEffect(() => {
    refreshRequests();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CLIENT_REQUESTS_STORAGE_KEY) refreshRequests();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshRequests]);

  const projectTypeLabel = (type: string) => {
    const key = `project.type.${type}`;
    const translated = t(key);
    return translated !== key ? translated : type;
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const filteredRequests = requests.filter((req) => {
    const term = searchTerm.toLowerCase();
    return (
      req.name.toLowerCase().includes(term) ||
      req.phone.includes(term) ||
      req.idea.toLowerCase().includes(term) ||
      req.projectType.toLowerCase().includes(term)
    );
  });

  const handleView = (req: ClientRequest) => {
    setSelectedRequest(req);
    if (!req.read) {
      const updated = requests.map((r) =>
        r.id === req.id ? { ...r, read: true } : r
      );
      setRequests(updated);
      saveRequests(updated);
    }
  };

  const handleDelete = (id: string) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    saveRequests(updated);
    setDeleteConfirm(null);
    if (selectedRequest?.id === id) setSelectedRequest(null);
  };

  const unreadCount = requests.filter((r) => !r.read).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'ar' ? 'الرسائل' : 'Messages'}
            </h1>
            <p className="text-gray-400">
              {language === 'ar'
                ? 'عرض وإدارة رسائل العملاء من نموذج اتصل بنا'
                : 'View and manage client inquiries from the contact form'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
              </span>
            )}
            <button
              onClick={refreshRequests}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في الرسائل...' : 'Search messages...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'العميل' : 'Client'}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'نوع المشروع' : 'Project Type'}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Inbox className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400">
                        {language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {language === 'ar'
                          ? 'ستظهر هنا رسائل العملاء من نموذج اتصل بنا'
                          : 'Client inquiries from the contact form will appear here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className={`hover:bg-white/[0.02] transition-colors ${!req.read ? 'bg-blue-500/5' : ''}`}
                  >
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">{req.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} dir="ltr">
                      {req.phone}
                    </td>
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        {projectTypeLabel(req.projectType)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-gray-400 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      {formatDate(req.timestamp)}
                    </td>
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          req.read
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {req.read
                          ? (language === 'ar' ? 'مقروء' : 'Read')
                          : (language === 'ar' ? 'جديد' : 'New')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                        <button
                          onClick={() => handleView(req)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title={language === 'ar' ? 'عرض' : 'View'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(req.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {language === 'ar' ? 'تفاصيل الرسالة' : 'Message Details'}
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'الاسم' : 'Name'}</p>
                  <p className="text-white font-medium">{selectedRequest.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                  <p className="text-white font-medium" dir="ltr">{selectedRequest.phone}</p>
                </div>
              </div>

              {selectedRequest.socialLink && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Link2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'رابط التواصل' : 'Social Link'}</p>
                    <a
                      href={selectedRequest.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline truncate block"
                    >
                      {selectedRequest.socialLink}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'نوع المشروع' : 'Project Type'}</p>
                  <p className="text-white font-medium">{projectTypeLabel(selectedRequest.projectType)}</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">{language === 'ar' ? 'فكرة المشروع' : 'Project Idea'}</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.idea}</p>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {formatDate(selectedRequest.timestamp)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {language === 'ar'
                ? 'هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this message? This action cannot be undone.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
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

export default MessagesPage;
