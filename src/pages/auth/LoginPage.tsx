import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/user';
import { isApiConfigured } from '../../config/env';

const normalizeIdentifier = (value: string): string => value.trim().toLowerCase();
const normalizePhone = (value: string): string => value.replace(/\D/g, '');

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithCredentials,
    loginWithGoogle,
    getAllUsers,
    isGoogleOAuthConfigured,
  } = useAuth();
  const [stage, setStage] = useState<'identifier' | 'password'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.authStatus === 'pending_review' || user.authStatus === 'pending_registration') {
        navigate('/onboarding/step-1', { replace: true });
      } else if (user.authStatus === 'pending_approval') {
        navigate('/pending-approval', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const findUser = (value: string): User | undefined => {
    const normalized = normalizeIdentifier(value);
    const normalizedPhone = normalizePhone(value);

    return getAllUsers().find((candidate) => {
      return (
        normalizeIdentifier(candidate.username || '') === normalized ||
        normalizeIdentifier(candidate.email || '') === normalized ||
        normalizeIdentifier(candidate.nationalId || '') === normalized ||
        normalizePhone(candidate.phone || '') === normalizedPhone
      );
    });
  };

  const handleNext = () => {
    setError('');

    if (!identifier.trim()) {
      setError('يرجى إدخال رقم الهاتف أو المعرف.');
      return;
    }

    if (import.meta.env.PROD && !isApiConfigured()) {
      setError('تسجيل الدخول غير متاح قبل إعداد خادم المصادقة.');
      return;
    }

    if (isApiConfigured()) {
      setFoundUser(null);
      setStage('password');
      return;
    }

    const userMatch = findUser(identifier);
    if (!userMatch) {
      setError('لم نعثر على حساب بهذا المعرف. تأكد من البيانات وحاول مرة أخرى.');
      return;
    }

    setFoundUser(userMatch);
    setStage('password');
  };

  const handleLogin = async () => {
    if (!foundUser && !isApiConfigured()) {
      setError('حدث خطأ داخلي، يرجى إعادة المحاولة.');
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setError('');
    const result = await loginWithCredentials(foundUser?.username || identifier, password, rememberMe);

    if (!result.success) {
      setError(result.error || 'حدث خطأ أثناء تسجيل الدخول.');
      return;
    }

    if (result.user?.authStatus === 'pending_review' || result.user?.authStatus === 'pending_registration') {
      navigate('/onboarding/step-1', { replace: true });
    } else if (result.user?.authStatus === 'pending_approval') {
      navigate('/pending-approval', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle(rememberMe);

    if (!result.success) {
      setError(result.error || 'تعذر تسجيل الدخول بواسطة Google.');
      return;
    }

    if (result.user?.authStatus === 'pending_review' || result.user?.authStatus === 'pending_registration') {
      navigate('/onboarding/step-1', { replace: true });
    } else if (result.user?.authStatus === 'pending_approval') {
      navigate('/pending-approval', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };

  const handleBack = () => {
    setStage('identifier');
    setPassword('');
    setFoundUser(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#0b1221]/90 p-8 shadow-2xl shadow-blue-500/10">
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-sky-500 shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-black tracking-tight">AX</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold">AXIOMX</h1>
            <p className="text-sm text-gray-300 mt-2">سجل دخولك أو أنشئ حساباً جديداً.</p>
          </div>
        </div>

        {import.meta.env.PROD ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            لوحة الإدارة غير مفعّلة في نسخة الإنتاج حتى ربط خادم المصادقة وإدارة المحتوى.
          </div>
        ) : stage === 'identifier' ? (
          <div className="space-y-5">
            <label className="space-y-2 text-sm text-gray-300">
              <span>رقم الهاتف أو المعرف</span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="0501234567 أو username"
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-300">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
                />
                تذكرني
              </label>
              {isGoogleOAuthConfigured && !import.meta.env.PROD && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  <Globe className="w-4 h-4" />
                  Google
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-white font-semibold shadow-lg shadow-blue-500/20 transition hover:brightness-110"
            >
              التالي
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-400">
              ليس لديك حساب؟{' '}
              <Link to="/employee-registration" className="text-blue-400 hover:text-blue-300 transition-colors">
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">تسجيل الدخول</p>
              <p className="mt-2 text-lg font-semibold text-white">
                مرحباً، {foundUser?.fullName || foundUser?.username || identifier}
              </p>
              <p className="mt-1 text-sm text-gray-400">أدخل كلمة المرور لإكمال الدخول.</p>
            </div>

            <label className="relative block text-sm text-gray-300">
              <span className="mb-2 block">كلمة المرور</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 pr-12 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="***********"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white transition hover:bg-white/10"
              >
                رجوع
              </button>
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
              >
                تسجيل الدخول
              </button>
            </div>

            {/* Register Link in Password Stage */}
            {!import.meta.env.PROD && <div className="text-center text-sm text-gray-400">
              ليس لديك حساب؟{' '}
              <Link to="/employee-registration" className="text-blue-400 hover:text-blue-300 transition-colors">
                إنشاء حساب جديد
              </Link>
            </div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
