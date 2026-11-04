// =====================================================
// TEAM BLOCK COMPONENT - AXIOMX ADMIN SYSTEM
// Phase 4D: Team Block
// =====================================================

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  TeamBlock,
  Block,
} from './blockTypes';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Code,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  GripVertical,
  Settings,
  LayoutGrid,
  List,
  GalleryHorizontal,
  UserPlus,
} from 'lucide-react';
import { BlockActionBar } from './BlockComponents';
import {
  TEAM_DATABASE,
  getTeamMemberById,
  getTeamMembersByIds,
  searchTeamMembers,
  TeamEmployee,
} from '../../data/teamDatabase';

// =====================================================
// PROFILE MODAL
// =====================================================

interface ProfileModalProps {
  member: TeamEmployee;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ member, isOpen, onClose }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (!isOpen) return null;

  const fullName = language === 'ar' ? member.fullNameAr : member.fullName;
  const jobTitle = language === 'ar' ? member.jobTitleAr : member.jobTitle;
  const department = language === 'ar' ? member.departmentAr : member.department;
  const bio = language === 'ar' ? member.bioAr : member.bio;
  const specialization = language === 'ar' ? member.specializationAr : member.specialization;
  const skills = language === 'ar' ? member.skillsAr : member.skills;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-16 mb-4">
            <div className="relative w-32 h-32 rounded-2xl border-4 border-[#0a0a0a] overflow-hidden shadow-xl">
              <img
                src={member.avatar}
                alt={fullName}
                className="w-full h-full object-cover"
              />
              <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} px-2 py-1 bg-green-500/90 rounded-full text-xs text-white font-medium`}>
                {member.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : member.status}
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{fullName}</h2>
            <p className="text-blue-400 font-medium">{jobTitle}</p>
            <p className="text-gray-500 text-sm">{department}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">{bio}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                <p className="text-sm text-white truncate">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                <p className="text-sm text-white truncate">{member.phone}</p>
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-gray-400">
                {language === 'ar' ? 'التخصص' : 'Specialization'}
              </h3>
            </div>
            <p className="text-white">{specialization}</p>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-gray-400">
                {language === 'ar' ? 'المهارات' : 'Skills'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          {member.socialLinks && (
            <div className="flex gap-3 pt-4 border-t border-white/10">
              {member.socialLinks.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </a>
              )}
              {member.socialLinks.twitter && (
                <a
                  href={member.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-sky-500/20 hover:bg-sky-500/30 rounded-xl transition-colors"
                >
                  <Twitter className="w-5 h-5 text-sky-400" />
                </a>
              )}
              {member.socialLinks.github && (
                <a
                  href={member.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-500/20 hover:bg-gray-500/30 rounded-xl transition-colors"
                >
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// TEAM MEMBER CARD
// =====================================================

interface TeamMemberCardProps {
  member: TeamEmployee;
  onClick: () => void;
  isRTL: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick, isRTL }) => {
  const { language } = useLanguage();
  const fullName = language === 'ar' ? member.fullNameAr : member.fullName;
  const jobTitle = language === 'ar' ? member.jobTitleAr : member.jobTitle;
  const skills = language === 'ar' ? member.skillsAr : member.skills;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <img
            src={member.avatar}
            alt={fullName}
            className="w-full h-full rounded-xl object-cover border-2 border-white/10 group-hover:border-blue-500/50 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
            {fullName}
          </h3>
          <p className="text-sm text-blue-400 mb-2">{jobTitle}</p>

          {/* Skills Preview */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-500/10 rounded text-xs text-blue-400/80"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-500">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/60 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <div className="flex items-center gap-2 text-white">
            <ExternalLink className="w-5 h-5" />
            <span className="font-medium">
              {language === 'ar' ? 'عرض الملف' : 'View Profile'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// TEAM BLOCK COMPONENT
// =====================================================

interface TeamBlockComponentProps {
  block: TeamBlock;
  onUpdate: (updates: Partial<TeamBlock>) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCopy: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const TeamBlockComponent: React.FC<TeamBlockComponentProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamEmployee | null>(null);

  const canEdit = user?.role === 'owner' || user?.role === 'admin';

  // Get team members based on selected IDs
  const teamMembers = useMemo(() => {
    if (block.memberIds.length === 0) {
      return TEAM_DATABASE;
    }
    return getTeamMembersByIds(block.memberIds);
  }, [block.memberIds]);

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return teamMembers;
    }
    return teamMembers.filter(member => {
      const searchLower = searchQuery.toLowerCase();
      if (isRTL) {
        return (
          member.fullNameAr.toLowerCase().includes(searchLower) ||
          member.jobTitleAr.toLowerCase().includes(searchLower)
        );
      }
      return (
        member.fullName.toLowerCase().includes(searchLower) ||
        member.jobTitle.toLowerCase().includes(searchLower)
      );
    });
  }, [teamMembers, searchQuery, isRTL]);

  // Available members for picker
  const availableMembers = useMemo(() => {
    return TEAM_DATABASE.filter(m => !block.memberIds.includes(m.id));
  }, [block.memberIds]);

  const handleAddMember = (memberId: string) => {
    onUpdate({ memberIds: [...block.memberIds, memberId] });
    setShowMemberPicker(false);
  };

  const handleRemoveMember = (memberId: string) => {
    onUpdate({ memberIds: block.memberIds.filter(id => id !== memberId) });
  };

  const handleLayoutChange = (layout: 'grid' | 'list' | 'carousel') => {
    onUpdate({ layout });
  };

  const handleToggleSearch = () => {
    onUpdate({ showSearch: !block.showSearch });
  };

  // Get content based on language
  const displayTitle = isRTL ? block.title.ar : block.title.en;
  const displayDescription = isRTL ? block.description.ar : block.description.en;

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-4 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {language === 'ar' ? 'كتلة الفريق' : 'Team Block'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'أضف وأدر أعضاء الفريق' : 'Add and manage team members'}
              </p>
            </div>
          </div>

          {/* Title Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {language === 'ar' ? 'العنوان (EN)' : 'Title (EN)'}
              </label>
              <input
                type="text"
                value={block.title.en}
                onChange={(e) => onUpdate({ title: { ...block.title, en: e.target.value } })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                placeholder="Our Team"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {language === 'ar' ? 'العنوان (AR)' : 'Title (AR)'}
              </label>
              <input
                type="text"
                value={block.title.ar}
                onChange={(e) => onUpdate({ title: { ...block.title, ar: e.target.value } })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                placeholder="فريقنا"
                dir="rtl"
              />
            </div>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {language === 'ar' ? 'الوصف (EN)' : 'Description (EN)'}
              </label>
              <textarea
                value={block.description.en}
                onChange={(e) => onUpdate({ description: { ...block.description, en: e.target.value } })}
                rows={2}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Meet our talented team..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {language === 'ar' ? 'الوصف (AR)' : 'Description (AR)'}
              </label>
              <textarea
                value={block.description.ar}
                onChange={(e) => onUpdate({ description: { ...block.description, ar: e.target.value } })}
                rows={2}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="تعرف على فريقنا الموهوب..."
                dir="rtl"
              />
            </div>
          </div>

          {/* Layout Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'ar' ? 'تخطيط العرض' : 'Display Layout'}
            </label>
            <div className="flex gap-2">
              {(['grid', 'list', 'carousel'] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => handleLayoutChange(layout)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    block.layout === layout
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {layout === 'grid' && <LayoutGrid className="w-4 h-4" />}
                  {layout === 'list' && <List className="w-4 h-4" />}
                  {layout === 'carousel' && <GalleryHorizontal className="w-4 h-4" />}
                  {language === 'ar'
                    ? layout === 'grid'
                      ? 'شبكة'
                      : layout === 'list'
                      ? 'قائمة'
                      : 'دائري'
                    : layout.charAt(0).toUpperCase() + layout.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                {language === 'ar' ? 'إظهار البحث' : 'Show Search'}
              </span>
            </div>
            <button
              onClick={handleToggleSearch}
              className={`w-12 h-6 rounded-full transition-colors ${
                block.showSearch ? 'bg-blue-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  block.showSearch ? (isRTL ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Current Members */}
          {block.memberIds.length > 0 && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {language === 'ar' ? 'الأعضاء المحددون' : 'Selected Members'} ({block.memberIds.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {block.memberIds.map((memberId) => {
                  const member = getTeamMemberById(memberId);
                  if (!member) return null;
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                    >
                      <img
                        src={member.avatar}
                        alt={isRTL ? member.fullNameAr : member.fullName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="flex-1 text-sm text-white truncate">
                        {isRTL ? member.fullNameAr : member.fullName}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Member Button */}
          {availableMembers.length > 0 && (
            <button
              onClick={() => setShowMemberPicker(!showMemberPicker)}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {language === 'ar' ? 'إضافة عضو جديد' : 'Add New Member'}
            </button>
          )}

          {/* Member Picker */}
          {showMemberPicker && (
            <div className="p-4 bg-black/20 rounded-xl border border-white/10">
              <h4 className="text-sm text-gray-400 mb-3">
                {language === 'ar' ? 'اختر عضواً' : 'Choose a member'}
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {availableMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleAddMember(member.id)}
                    className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <img
                      src={member.avatar}
                      alt={isRTL ? member.fullNameAr : member.fullName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="text-xs text-white truncate">
                      {isRTL ? member.fullNameAr : member.fullName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={onEndEdit}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div
          onClick={canEdit ? onStartEdit : undefined}
          className={canEdit ? 'cursor-pointer' : ''}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {displayTitle || (language === 'ar' ? 'فريقنا' : 'Our Team')}
            </h2>
            {displayDescription && (
              <p className="text-gray-400 max-w-2xl mx-auto">
                {displayDescription}
              </p>
            )}
          </div>

          {/* Search Bar */}
          {block.showSearch && (
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن عضو...' : 'Search for a member...'}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Team Members Grid/List */}
          {filteredMembers.length > 0 ? (
            <div
              className={
                block.layout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : block.layout === 'list'
                  ? 'space-y-4'
                  : 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory'
              }
            >
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={
                    block.layout === 'grid'
                      ? ''
                      : block.layout === 'list'
                      ? ''
                      : 'flex-shrink-0 w-72 snap-start'
                  }
                >
                  {block.layout === 'list' ? (
                    <div
                      onClick={() => setSelectedMember(member)}
                      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl cursor-pointer transition-all"
                    >
                      <img
                        src={member.avatar}
                        alt={isRTL ? member.fullNameAr : member.fullName}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold">
                          {isRTL ? member.fullNameAr : member.fullName}
                        </h3>
                        <p className="text-blue-400 text-sm">
                          {isRTL ? member.jobTitleAr : member.jobTitle}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </div>
                  ) : (
                    <TeamMemberCard
                      member={member}
                      onClick={() => setSelectedMember(member)}
                      isRTL={isRTL}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery
                  ? (language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found')
                  : (language === 'ar' ? 'لا يوجد أعضاء في الفريق' : 'No team members')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        member={selectedMember!}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};

export { TeamBlockComponent, ProfileModal, TeamMemberCard };