import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MessageItem {
  id: string;
  from: 'admin' | 'user';
  text: string;
  time: string;
}

const buildStorageKey = (requestId: string) => `employee-pending-chat-${requestId}`;

const EmployeePendingPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState('');
  const navigate = useNavigate();

  const requestId = useMemo(() => user?.requestId || '', [user?.requestId]);

  useEffect(() => {
    if (!requestId) return;
    const stored = window.localStorage.getItem(buildStorageKey(requestId));
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
        return;
      } catch {
        // ignore invalid stored messages
      }
    }
    setMessages([
      {
        id: 'admin-0',
        from: 'admin',
        text: 'مرحباً! طلبك تحت المراجعة. يمكنك إرسال رسالة داخلية للإدارة هنا.',
        time: new Date().toLocaleTimeString('ar-EG'),
      },
    ]);
  }, [requestId]);

  useEffect(() => {
    if (!requestId) return;
    window.localStorage.setItem(buildStorageKey(requestId), JSON.stringify(messages));
  }, [messages, requestId]);

  const sendMessage = () => {
    if (!draft.trim() || !requestId) return;
    const next: MessageItem = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('ar-EG'),
    };
    setMessages((prev) => [...prev, next]);
    setDraft('');
  };

  if (!isAuthenticated && !isLoading) {
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

  if (!user || !['pending_review', 'pending_approval', 'pending_registration'].includes(user.authStatus || '')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#0b1221]/95 p-8 shadow-2xl shadow-blue-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">الحالة الحالية</p>
            <h1 className="mt-3 text-4xl font-semibold">طلب قيد المراجعة</h1>
            <p className="mt-2 text-gray-400">سيتم التواصل معك فور مراجعة طلبك من قبل فريق الإدارة.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-gray-200 hover:border-blue-500 hover:text-white"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">رقم الطلب</p>
            <p className="mt-3 text-2xl font-semibold text-white">{user.requestId || 'غير متوفر'}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">تاريخ الإرسال</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {user.requestSubmittedAt ? new Date(user.requestSubmittedAt).toLocaleString('ar-EG') : 'غير متوفر'}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6 text-gray-200">
          <h2 className="text-lg font-semibold text-white">ماذا يحدث الآن؟</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7">
            <li>• فريق الإدارة يقوم بمراجعة بياناتك والمستندات المرفوعة.</li>
            <li>• لن يتم منح أي صلاحيات إدارية حتى الموافقة النهائية.</li>
            <li>• يمكنك التواصل مع الإدارة عبر المحادثة الداخلية أدناه.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-[#09101b] p-6">
          <h2 className="text-xl font-semibold text-white">الشات الداخلي مع الإدارة</h2>
          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl p-4 ${message.from === 'admin' ? 'bg-white/5 self-start' : 'bg-blue-500/10 self-end'}`}
              >
                <p className="text-sm text-gray-200">{message.text}</p>
                <p className="mt-2 text-xs text-gray-500">{message.time}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full rounded-3xl border border-white/10 bg-[#0b1221] p-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="اكتب رسالة إلى الإدارة..."
            />
            <button
              type="button"
              onClick={sendMessage}
              className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              إرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePendingPage;
