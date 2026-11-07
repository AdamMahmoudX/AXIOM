// =====================================================
// SERVICE WORKFLOW CONTROLS - AXIOMX ADMIN SYSTEM
// Phase 6A-4: Service Workflow Controls
// Phase 6A-5: Integration with Approval System
// =====================================================

import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import {
  ServiceStatus,
  SERVICE_STATUS_LABELS,
  SERVICE_STATUS_COLORS,
} from '../types/project';
import {
  Send,
  CheckCircle,
  Eye,
  Archive,
  XCircle,
  ChevronRight,
  Lock,
  AlertCircle,
  History,
  ChevronDown,
} from 'lucide-react';
import Portal from './Portal';
import {
  ApprovalHistory,
  ApprovalActionPanel,
  ApprovalSummary,
  ApprovalBadge,
} from './ServiceApprovalSystem';

// =====================================================
// WORKFLOW TRANSITIONS CONFIGURATION (Phase 6A-4)
// =====================================================

// Define allowed transitions for each status
export type WorkflowTransition =
  | 'submit_for_review'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore';

interface WorkflowTransitionConfig {
  transition: WorkflowTransition;
  fromStatus: ServiceStatus;
  toStatus: ServiceStatus;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  requiredPermission: string;
  disabled?: boolean;
  disabledReason?: string;
}

// Define all possible transitions
export const WORKFLOW_TRANSITIONS: WorkflowTransitionConfig[] = [
  // Draft -> Review
  {
    transition: 'submit_for_review',
    fromStatus: 'draft',
    toStatus: 'review',
    labelEn: 'Submit for Review',
    labelAr: 'إرسال للمراجعة',
    icon: <Send className="w-4 h-4" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30',
    requiredPermission: 'service_edit',
  },
  // Review -> Approved
  {
    transition: 'approve',
    fromStatus: 'review',
    toStatus: 'approved',
    labelEn: 'Approve',
    labelAr: 'موافقة',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30',
    requiredPermission: 'service_publish',
  },
  // Review -> Draft (Reject)
  {
    transition: 'reject',
    fromStatus: 'review',
    toStatus: 'draft',
    labelEn: 'Request Changes',
    labelAr: 'طلب تعديلات',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30',
    requiredPermission: 'service_publish',
  },
  // Approved -> Published
  {
    transition: 'publish',
    fromStatus: 'approved',
    toStatus: 'published',
    labelEn: 'Publish',
    labelAr: 'نشر',
    icon: <Eye className="w-4 h-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30',
    requiredPermission: 'service_publish',
  },
  // Published -> Draft (Unpublish)
  {
    transition: 'unpublish',
    fromStatus: 'published',
    toStatus: 'draft',
    labelEn: 'Unpublish',
    labelAr: 'إلغاء النشر',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30',
    requiredPermission: 'service_publish',
  },
  // Any -> Archived
  {
    transition: 'archive',
    fromStatus: 'draft',
    toStatus: 'archived',
    labelEn: 'Archive',
    labelAr: 'أرشفة',
    icon: <Archive className="w-4 h-4" />,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30',
    requiredPermission: 'service_delete',
  },
  {
    transition: 'archive',
    fromStatus: 'review',
    toStatus: 'archived',
    labelEn: 'Archive',
    labelAr: 'أرشفة',
    icon: <Archive className="w-4 h-4" />,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30',
    requiredPermission: 'service_delete',
  },
  {
    transition: 'archive',
    fromStatus: 'approved',
    toStatus: 'archived',
    labelEn: 'Archive',
    labelAr: 'أرشفة',
    icon: <Archive className="w-4 h-4" />,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30',
    requiredPermission: 'service_delete',
  },
  {
    transition: 'archive',
    fromStatus: 'published',
    toStatus: 'archived',
    labelEn: 'Archive',
    labelAr: 'أرشفة',
    icon: <Archive className="w-4 h-4" />,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30',
    requiredPermission: 'service_delete',
  },
  // Archived -> Draft (Restore)
  {
    transition: 'restore',
    fromStatus: 'archived',
    toStatus: 'draft',
    labelEn: 'Restore',
    labelAr: 'استعادة',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30',
    requiredPermission: 'service_edit',
  },
];

// =====================================================
// PERMISSION CHECK HELPER (Phase 6A-4)
// =====================================================

interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
}

const checkTransitionPermission = (
  transition: WorkflowTransitionConfig,
  userRole: string,
  serviceRole: string | undefined,
  effectivePermissions: string[]
): PermissionCheckResult => {
  // Map permission names
  const permissionMap: Record<string, string> = {
    'service_edit': 'service_edit',
    'service_publish': 'service_publish',
    'service_delete': 'service_delete',
  };

  const requiredPermission = permissionMap[transition.requiredPermission] || transition.requiredPermission;

  if (effectivePermissions.includes(requiredPermission)) {
    return { hasPermission: true };
  }

  return {
    hasPermission: false,
    reason: 'permission_denied',
  };
};

// =====================================================
// WORKFLOW STATUS BADGE COMPONENT (Phase 6A-4)
// =====================================================

interface WorkflowStatusBadgeProps {
  status: ServiceStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({
  status,
  showLabel = true,
  size = 'md',
}) => {
  const { language } = useLanguage();
  const config = SERVICE_STATUS_COLORS[status];
  const labels = SERVICE_STATUS_LABELS[status];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showLabel && (labels[language === 'ar' ? 'ar' : 'en'])}
    </span>
  );
};

// =====================================================
// WORKFLOW TRANSITION BUTTON COMPONENT (Phase 6A-4)
// =====================================================

interface WorkflowTransitionButtonProps {
  transition: WorkflowTransitionConfig;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

export const WorkflowTransitionButton: React.FC<WorkflowTransitionButtonProps> = ({
  transition,
  onClick,
  disabled = false,
  disabledReason,
}) => {
  const { language } = useLanguage();

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-white/10 bg-white/5'
            : `${transition.bgColor} border-current hover:scale-105`
        }`}
      >
        <span className={transition.color}>{transition.icon}</span>
        <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : transition.color}`}>
          {language === 'ar' ? transition.labelAr : transition.labelEn}
        </span>
        {!disabled && <ChevronRight className={`w-4 h-4 ${transition.color}`} />}
      </button>

      {/* Disabled tooltip */}
      {disabled && disabledReason && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            {disabledReason}
          </div>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

// =====================================================
// SERVICE WORKFLOW CONTROLS COMPONENT (Phase 6A-4)
// =====================================================

interface ServiceWorkflowControlsProps {
  serviceId: string;
  currentStatus: ServiceStatus;
  onStatusChange: (newStatus: ServiceStatus) => void;
  showCompact?: boolean;
  showAllOptions?: boolean;
  showApprovalPanel?: boolean;
  showApprovalHistory?: boolean;
}

const ServiceWorkflowControls: React.FC<ServiceWorkflowControlsProps> = ({
  serviceId,
  currentStatus,
  onStatusChange,
  showCompact = false,
  showAllOptions = false,
  showApprovalPanel = false,
  showApprovalHistory = false,
}) => {
  const { language } = useLanguage();
  const { user, getEffectivePermissionsList } = useAuth();
  const { getApprovalHistory, getApprovalRequests } = useServices();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<WorkflowTransitionConfig | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const effectivePermissions = useMemo(() => {
    return getEffectivePermissionsList();
  }, [getEffectivePermissionsList]);

  // Get available transitions for current status
  const availableTransitions = useMemo(() => {
    return WORKFLOW_TRANSITIONS.filter(t => t.fromStatus === currentStatus);
  }, [currentStatus]);

  // Check permissions for each transition
  const transitionsWithPermissions = useMemo(() => {
    return availableTransitions.map(transition => {
      const permissionCheck = checkTransitionPermission(
        transition,
        user?.role || 'employee',
        user?.serviceRole,
        effectivePermissions
      );

      return {
        ...transition,
        ...permissionCheck,
        disabled: !permissionCheck.hasPermission,
        disabledReason: permissionCheck.hasPermission
          ? undefined
          : (language === 'ar' ? 'ليس لديك الصلاحية' : 'No permission'),
      };
    });
  }, [availableTransitions, user, effectivePermissions, language]);

  // Handle transition click
  const handleTransitionClick = (transition: WorkflowTransitionConfig) => {
    if (transition.disabled) return;

    // Show confirmation modal for publish/unpublish
    if (transition.transition === 'publish' || transition.transition === 'unpublish') {
      setPendingTransition(transition);
      setShowConfirmModal(true);
    } else {
      // Direct status change
      onStatusChange(transition.toStatus);
    }
  };

  // Confirm transition
  const confirmTransition = () => {
    if (pendingTransition) {
      onStatusChange(pendingTransition.toStatus);
      setShowConfirmModal(false);
      setPendingTransition(null);
    }
  };

  // Get confirmation message
  const getConfirmationMessage = (transition: WorkflowTransitionConfig) => {
    if (transition.transition === 'publish') {
      return language === 'ar'
        ? 'هل أنت متأكد من نشر هذه الخدمة؟ سيتمكن المستخدمون من رؤيتها.'
        : 'Are you sure you want to publish this service? Users will be able to see it.';
    }
    if (transition.transition === 'unpublish') {
      return language === 'ar'
        ? 'هل أنت متأكد من إلغاء نشر هذه الخدمة؟ لن يتمكن المستخدمون من رؤيتها.'
        : 'Are you sure you want to unpublish this service? Users will not be able to see it.';
    }
    return language === 'ar'
      ? `هل أنت متأكد من ${pendingTransition?.labelAr.toLowerCase()} هذه الخدمة؟`
      : `Are you sure you want to ${pendingTransition?.labelEn.toLowerCase()} this service?`;
  };

  // Filter transitions based on showAllOptions
  const displayTransitions = showAllOptions
    ? transitionsWithPermissions
    : transitionsWithPermissions.filter(t => !t.disabled);

  if (displayTransitions.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`${showCompact ? 'flex items-center gap-2' : 'space-y-3'}`}>
        {showCompact ? (
          // Compact view - show as dropdown
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
              <WorkflowStatusBadge status={currentStatus} size="sm" />
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {displayTransitions.map((transition, index) => (
                <button
                  key={`${transition.transition}-${index}`}
                  onClick={() => handleTransitionClick(transition)}
                  disabled={transition.disabled}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                    transition.disabled
                      ? 'opacity-50 cursor-not-allowed text-gray-500'
                      : `hover:bg-white/10 ${transition.color}`
                  }`}
                >
                  <span>{transition.icon}</span>
                  <span className="text-sm font-medium">
                    {language === 'ar' ? transition.labelAr : transition.labelEn}
                  </span>
                  {transition.disabled && <Lock className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Full view - show as buttons
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'تغيير الحالة:' : 'Change Status:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {displayTransitions.map((transition, index) => (
                <WorkflowTransitionButton
                  key={`${transition.transition}-${index}`}
                  transition={transition}
                  onClick={() => handleTransitionClick(transition)}
                  disabled={transition.disabled}
                  disabledReason={transition.disabledReason}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Approval Panel (Phase 6A-5) */}
      {showApprovalPanel && (
        <div className="mt-4">
          <ApprovalActionPanel
            serviceId={serviceId}
            currentStatus={currentStatus}
            onApprovalComplete={() => {}}
          />
        </div>
      )}

      {/* Approval History Toggle (Phase 6A-5) */}
      {showApprovalHistory && (
        <div className="mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors w-full"
          >
            <History className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {language === 'ar' ? 'سجل الموافقات' : 'Approval History'}
            </span>
            {showHistory ? (
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3">
              <ApprovalHistory entries={getApprovalHistory(serviceId)} />
            </div>
          )}
        </div>
      )}

      {/* Approval Summary (Phase 6A-5) */}
      {currentStatus === 'review' && (
        <div className="mt-4">
          <ApprovalSummary serviceId={serviceId} />
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && pendingTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${pendingTransition.bgColor}`}>
                <span className={pendingTransition.color}>{pendingTransition.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ar' ? 'تأكيد التغيير' : 'Confirm Change'}
              </h3>
              <p className="text-gray-400 mb-6">
                {getConfirmationMessage(pendingTransition)}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={confirmTransition}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors ${pendingTransition.bgColor} ${pendingTransition.color}`}
                >
                  {language === 'ar' ? pendingTransition.labelAr : pendingTransition.labelEn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// =====================================================
// WORKFLOW TIMELINE COMPONENT (Phase 6A-4)
// =====================================================

interface WorkflowTimelineProps {
  currentStatus: ServiceStatus;
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  currentStatus,
  createdAt,
  publishedAt,
  updatedAt,
}) => {
  const { language } = useLanguage();

  const steps = [
    { status: 'draft' as ServiceStatus, label: language === 'ar' ? 'مسودة' : 'Draft' },
    { status: 'review' as ServiceStatus, label: language === 'ar' ? 'مراجعة' : 'Review' },
    { status: 'approved' as ServiceStatus, label: language === 'ar' ? 'موافق' : 'Approved' },
    { status: 'published' as ServiceStatus, label: language === 'ar' ? 'منشور' : 'Published' },
  ];

  const statusOrder: ServiceStatus[] = ['draft', 'review', 'approved', 'published'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isArchived = currentStatus === 'archived';

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-blue-400" />
        {language === 'ar' ? 'حالة سير العمل' : 'Workflow Status'}
      </h4>

      {/* Timeline */}
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all"
          style={{ width: `${Math.min(100, (currentIndex / (steps.length - 1)) * 100)}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="relative flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-[#0a0a0a] border-white/20'
                }`}
              >
                {isCompleted && (
                  <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-white/70'}`} />
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                isCurrent ? 'text-blue-400' : isCompleted ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Archived indicator */}
      {isArchived && (
        <div className="mt-4 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400">
            <Archive className="w-4 h-4" />
            <span className="text-sm">{language === 'ar' ? 'تم أرشفة هذه الخدمة' : 'This service has been archived'}</span>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{language === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}</span>
          <span className="text-gray-400">{formatDate(createdAt)}</span>
        </div>
        {publishedAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{language === 'ar' ? 'تاريخ النشر:' : 'Published:'}</span>
            <span className="text-gray-400">{formatDate(publishedAt)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{language === 'ar' ? 'آخر تحديث:' : 'Updated:'}</span>
          <span className="text-gray-400">{formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default ServiceWorkflowControls;