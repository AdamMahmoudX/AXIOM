import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PendingApprovalPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && (user?.authStatus === 'pending_review' || user?.authStatus === 'pending_registration')) {
      navigate('/onboarding/step-1', { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p>جاري التحقق من حالة الطلب...</p>
        </div>
      </div>
    );
  }

  if (user?.authStatus !== 'pending_approval') {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0b1221]/90 p-8 shadow-2xl shadow-blue-500/10">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">حالة الطلب</p>
          <h1 className="mt-4 text-4xl font-semibold">قيد المراجعة</h1>
          <p className="mt-2 text-gray-400">طلبك قيد الفحص من قبل الإدارة. سنعلمك عند اتخاذ قرار.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-gray-400">رقم الطلب</p>
            <p className="mt-2 text-xl font-semibold text-white">{user.requestId ?? 'غير متوفر'}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-gray-400">تاريخ الإرسال</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {user.requestSubmittedAt ? new Date(user.requestSubmittedAt).toLocaleString('ar-EG') : 'غير متوفر'}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6 text-gray-200">
          <h2 className="text-lg font-semibold text-white">ماذا يحدث الآن؟</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li>• فريق الإدارة يراجع معلوماتك والمستندات المرفوعة.</li>
            <li>• ستتلقى إشعارًا عند الموافقة أو الرفض.</li>
            <li>• لن تتمكن من الوصول إلى لوحة التحكم حتى تُفعّل الحالة.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
