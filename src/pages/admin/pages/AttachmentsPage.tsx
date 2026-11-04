import React, { useMemo } from 'react';
import { ExternalLink, FileImage, Paperclip, User } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useEmployees } from '../../../context/EmployeeContext';
import { useProjects } from '../../../context/ProjectContext';
import { useArticles } from '../../../context/ArticleContext';
import { loadClientRequests } from '../../../utils/clientRequestsStorage';

interface AttachmentItem {
  id: string;
  label: string;
  url: string;
  category: 'employee' | 'project' | 'article' | 'request';
}

const AttachmentsPage: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { employees } = useEmployees();
  const { projects } = useProjects();
  const { articles } = useArticles();

  const attachments = useMemo(() => {
    const items: AttachmentItem[] = [];

    employees.forEach((employee) => {
      if (employee.avatar) {
        items.push({
          id: `emp-avatar-${employee.id}`,
          label: `${employee.fullName} · Avatar`,
          url: employee.avatar,
          category: 'employee',
        });
      }
      if (employee.idCardImage) {
        items.push({
          id: `emp-id-${employee.id}`,
          label: `${employee.fullName} · ID`,
          url: employee.idCardImage,
          category: 'employee',
        });
      }
    });

    projects.forEach((project) => {
      if (project.image) {
        items.push({
          id: `proj-${project.id}`,
          label: project.name,
          url: project.image,
          category: 'project',
        });
      }
    });

    articles.forEach((article) => {
      const image = article.image;
      if (image) {
        items.push({
          id: `art-${article.id}`,
          label: article.title || article.id,
          url: image,
          category: 'article',
        });
      }
    });

    loadClientRequests<{ name?: string; idea?: string }>().forEach((request, index) => {
      if (request.idea?.startsWith('http')) {
        items.push({
          id: `req-${index}`,
          label: request.name || (language === 'ar' ? 'طلب عميل' : 'Client request'),
          url: request.idea,
          category: 'request',
        });
      }
    });

    return items;
  }, [articles, employees, language, projects]);

  const categoryLabel = (category: AttachmentItem['category']) => {
    const labels = {
      employee: language === 'ar' ? 'موظف' : 'Employee',
      project: language === 'ar' ? 'مشروع' : 'Project',
      article: language === 'ar' ? 'مقال' : 'Article',
      request: language === 'ar' ? 'طلب' : 'Request',
    };
    return labels[category];
  };

  return (
    <div className="space-y-6">
      <div className={isRTL ? 'text-end' : 'text-start'}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Paperclip className="w-7 h-7 text-blue-400" />
          {language === 'ar' ? 'المرفقات والملفات' : 'Attachments & Files'}
        </h1>
        <p className="text-gray-400 mt-1">
          {language === 'ar'
            ? 'روابط الملفات المخزّنة محلياً عبر النظام'
            : 'File URLs stored locally across the platform'}
        </p>
      </div>

      <div className="grid gap-3">
        {attachments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white/[0.02] border border-white/10 rounded-2xl">
            {language === 'ar' ? 'لا توجد مرفقات بعد' : 'No attachments found yet'}
          </div>
        ) : (
          attachments.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                {item.category === 'employee' ? <User className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-end' : 'text-start'}`}>
                <p className="text-sm font-medium text-white truncate">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.url}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {categoryLabel(item.category)}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                aria-label={language === 'ar' ? 'فتح الرابط' : 'Open link'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttachmentsPage;
