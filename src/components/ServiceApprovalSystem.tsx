// =====================================================
// SERVICE APPROVAL SYSTEM - AXIOMX ADMIN SYSTEM
// Phase 6A-5: Service Approval System with History
// =====================================================

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { ServiceStatus } from '../types/project';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  History,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import Portal from './Portal';

// =====================================================
// APPROVAL TYPES (Phase 6A-5)
// =====================================================

export type ApprovalAction = 'approve' | 'reject' | 'request_changes' | 'escalate';

export interface ApprovalComment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalEntry {
  id: string;
  serviceId: string;
  action: ApprovalAction;
  previousStatus: ServiceStatus;
  newStatus: ServiceStatus;
  approverId: string;
  approverName: string;
  approverRole: string;
  comments: ApprovalComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  serviceId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  reason?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

// =====================================================
// APPROVAL CONFIGURATION (Phase 6A-5)
// =====================================================

interface ApprovalActionConfig {
  action: ApprovalAction;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  targetStatus: ServiceStatus;
}

const APPROVAL_ACTIONS: ApprovalActionConfig[] = [
  {
    action: 'approve',
    labelEn: 'Approve',
    labelAr: 'موافقة',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30',
    targetStatus: 'approved',
  },
  {
    action: 'reject',
    labelEn: 'Reject',
    labelAr: 'رفض',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20 border-red-500/30',
    targetStatus: 'draft',
  },
  {
    action: 'request_changes',
    labelEn: 'Request Changes',
    labelAr: 'طلب تعديلات',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30',
    targetStatus: 'draft',
  },
  {
    action: 'escalate',
    labelEn: 'Escalate',
    labelAr: 'تصعيد',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    targetStatus: 'review',
  },
];

// =====================================================
// APPROVAL HISTORY COMPONENT (Phase 6A-5)
// =====================================================

interface ApprovalHistoryProps {
  entries: ApprovalEntry[];
  showCompact?: boolean;
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  entries,
  showCompact = false,
}) => {
  const { language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionLabel = (action: ApprovalAction) => {
    const config = APPROVAL_ACTIONS.find(a => a.action === action);
    if (!config) return action;
    return language === 'ar' ? config.labelAr : config.labelEn;
  };

  const getActionConfig = (action: ApprovalAction) => {
    return APPROVAL_ACTIONS.find(a => a.action === action) || APPROVAL_ACTIONS[0];
  };

  const getStatusLabel = (status: ServiceStatus) => {
    const labels: Record<ServiceStatus, { en: string; ar: string }> = {
      draft: { en: 'Draft', ar: 'مسودة' },
      review: { en: 'Review', ar: 'مراجعة' },
      approved: { en: 'Approved', ar: 'موافق' },
      published: { en: 'Published', ar: 'منشور' },
      archived: { en: 'Archived', ar: 'أرشيف' },
    };
    return labels[status]?.[language === 'ar' ? 'ar' : 'en'] || status;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">
          {language === 'ar' ? 'لا يوجد سجل موافقات' : 'No approval history'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${showCompact ? '' : 'max-h-96 overflow-y-auto pr-2'}`}>
      {entries.map((entry, index) => {
        const config = getActionConfig(entry.action);
        return (
          <div
            key={entry.id}
            className={`relative ${showCompact ? 'p-3' : 'p-4'} bg-[#0a0a0a] border border-white/5 rounded-xl`}
          >
            {/* Timeline connector */}
            {index < entries.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-3 bg-white/10 z-0" />
            )}

            <div className="flex items-start gap-3">
              {/* Action icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                <span className={config.color}>{config.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`font-semibold ${config.color}`}>
                    {getActionLabel(entry.action)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <User className="w-3 h-3" />
                  <span>{entry.approverName}</span>
                  <span className="px-1.5 py-0.5 bg-white/5 rounded text-xs">
                    {entry.approverRole}
                  </span>
                </div>

                {/* Status change */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">{language === 'ar' ? 'من' : 'From'}:</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-gray-300">
                    {getStatusLabel(entry.previousStatus)}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-gray-300">
                    {getStatusLabel(entry.newStatus)}
                  </span>
                </div>

                {/* Comments */}
                {entry.comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    {entry.comments.map(comment => (
                      <div key={comment.id} className="flex items-start gap-2 text-xs mb-2">
                        <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-400">{comment.createdBy}:</span>
                          <p className="text-gray-300 mt-0.5">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================
// APPROVAL ACTION PANEL (Phase 6A-5)
// =====================================================

interface ApprovalActionPanelProps {
  serviceId: string;
  currentStatus: ServiceStatus;
  onApprovalComplete: () => void;
}

export const ApprovalActionPanel: React.FC<ApprovalActionPanelProps> = ({
  serviceId,
  currentStatus,
  onApprovalComplete,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { performApproval, approvalHistory, getApprovalRequests } = useServices();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [comment, setComment] = useState('');

  const availableActions = useMemo(() => {
    // Only show approval actions for services in review status
    if (currentStatus !== 'review') return [];

    // Only users with publish permission can approve
    if (!user?.permissions?.service_publish) return [];

    return APPROVAL_ACTIONS;
  }, [currentStatus, user]);

  const handleActionSelect = (action: ApprovalAction) => {
    setSelectedAction(action);
    setShowCommentInput(true);
  };

  const handleSubmit = () => {
    if (!selectedAction || !user) return;

    const actionConfig = APPROVAL_ACTIONS.find(a => a.action === selectedAction);
    if (!actionConfig) return;

    performApproval(serviceId, selectedAction, {
      approverId: user.id,
      approverName: user.fullName || user.username || user.email,
      approverRole: user.role,
      comment: comment.trim() || undefined,
    });

    setComment('');
    setShowCommentInput(false);
    setSelectedAction(null);
    onApprovalComplete();
  };

  const handleCancel = () => {
    setComment('');
    setShowCommentInput(false);
    setSelectedAction(null);
  };

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <FileCheck className="w-4 h-4 text-blue-400" />
        {language === 'ar' ? 'إجراءات الموافقة' : 'Approval Actions'}
      </h4>

      {!showCommentInput ? (
        <div className="flex flex-wrap gap-2">
          {availableActions.map(action => {
            const config = action;
            return (
              <button
                key={action.action}
                onClick={() => handleActionSelect(action.action)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:scale-105 ${config.bgColor}`}
              >
                <span className={config.color}>{config.icon}</span>
                <span className={`text-sm font-medium ${config.color}`}>
                  {language === 'ar' ? config.labelAr : config.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400">
              {language === 'ar' ? 'إجراء محدد:' : 'Selected action:'}
              <span className="ml-2 text-white font-medium">
                {language === 'ar'
                  ? APPROVAL_ACTIONS.find(a => a.action === selectedAction)?.labelAr
                  : APPROVAL_ACTIONS.find(a => a.action === selectedAction)?.labelEn}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">
              {language === 'ar' ? 'تعليق (اختياري)' : 'Comment (optional)'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'ar' ? 'أضف تعليقاً...' : 'Add a comment...'}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
            >
              {language === 'ar' ? 'تأكيد' : 'Confirm'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// APPROVAL SUMMARY COMPONENT (Phase 6A-5)
// =====================================================

interface ApprovalSummaryProps {
  serviceId: string;
}

export const ApprovalSummary: React.FC<ApprovalSummaryProps> = ({ serviceId }) => {
  const { language } = useLanguage();
  const { approvalHistory, getApprovalRequests } = useServices();

  const history = approvalHistory[serviceId] || [];
  const requests = getApprovalRequests(serviceId);

  const recentApprovals = history.slice(-5).reverse();
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Pending requests indicator */}
      {pendingRequests.length > 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'ar'
                ? `${pendingRequests.length} طلب موافقة معلّق`
                : `${pendingRequests.length} pending approval request(s)`}
            </span>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {history.filter(h => h.action === 'approve').length}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'ar' ? 'موافقات' : 'Approvals'}
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            {history.filter(h => h.action === 'reject').length}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'ar' ? 'مرفوضات' : 'Rejections'}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      {recentApprovals.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-gray-400 mb-2">
            {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
          </h5>
          <div className="space-y-2">
            {recentApprovals.slice(0, 3).map(entry => {
              const config = APPROVAL_ACTIONS.find(a => a.action === entry.action);
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg text-xs"
                >
                  <span className={config?.color}>{config?.icon}</span>
                  <span className="text-gray-300 flex-1 truncate">
                    {entry.approverName}
                  </span>
                  <span className="text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// APPROVAL BADGE COMPONENT (Phase 6A-5)
// =====================================================

interface ApprovalBadgeProps {
  status: ServiceStatus;
  hasPendingRequests?: boolean;
}

export const ApprovalBadge: React.FC<ApprovalBadgeProps> = ({
  status,
  hasPendingRequests = false,
}) => {
  const { language } = useLanguage();

  const getBadgeConfig = () => {
    switch (status) {
      case 'review':
        return {
          label: language === 'ar' ? 'في المراجعة' : 'In Review',
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          dot: 'bg-amber-400',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'approved':
        return {
          label: language === 'ar' ? 'موافق عليه' : 'Approved',
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          dot: 'bg-green-400',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'draft':
        return {
          label: language === 'ar' ? 'مسودة' : 'Draft',
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          dot: 'bg-gray-400',
          icon: <FileCheck className="w-3 h-3" />,
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      {config.label}
      {hasPendingRequests && (
        <span className="ml-1 px-1 py-0.5 bg-amber-500/30 rounded text-amber-300">
          !
        </span>
      )}
    </span>
  );
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default {
  ApprovalHistory,
  ApprovalActionPanel,
  ApprovalSummary,
  ApprovalBadge,
};