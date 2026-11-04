import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FolderKanban, Boxes, FileText, Users, Mail, MessageSquare, Paperclip, Settings, Shield, Activity, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  FolderKanban,
  Boxes,
  FileText,
  Users,
  Mail,
  MessageSquare,
  Paperclip,
  Settings,
  Shield,
  Activity,
};

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  titleAr,
  description,
  descriptionAr,
  icon,
}) => {
  const { language } = useLanguage();
  const Icon = iconMap[icon] || Construction;

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
            <Icon className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
          <Construction className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">
            {language === 'ar' ? 'قريباً' : 'Coming Soon'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          {language === 'ar' ? titleAr : title}
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          {language === 'ar' ? descriptionAr : description}
        </p>

        {/* Decorative elements */}
        <div className="flex items-center justify-center gap-8 opacity-20">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;