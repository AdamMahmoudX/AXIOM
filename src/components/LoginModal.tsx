import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User as UserType } from '../types/user';

// =====================================================
// UNIFIED LOGIN MODAL - AXIOMX
// Flow: Identifier → Next → Password → Login
// =====================================================

const normalizeIdentifier = (value: string): string => value.trim().toLowerCase();
const normalizePhone = (value: string): string => value.replace(/\D/g, '');

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal, loginWithCredentials, getAllUsers } = useAuth();

  // Stage: 'identifier' or 'password'
  const [stage, setStage] = useState<'identifier' | 'password'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundUser, setFoundUser] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const findUser = (value: string): UserType | undefined => {
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

    const userMatch = findUser(identifier);
    if (!userMatch) {
      setError('لم نعثر على حساب بهذا المعرف.');
      return;
    }

    setFoundUser(userMatch);
    setStage('password');
  };

  const handleLogin = async () => {
    if (!foundUser) {
      setError('حدث خطأ داخلي، يرجى إعادة المحاولة.');
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await loginWithCredentials(foundUser.username || identifier, password, rememberMe);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'فشل تسجيل الدخول.');
      return;
    }

    closeLoginModal();
    navigate('/admin');
  };

  const handleBack = () => {
    setStage('identifier');
    setPassword('');
    setFoundUser(null);
    setError('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
      // Reset to identifier stage for next open
      setStage('identifier');
      setIdentifier('');
      setPassword('');
      setFoundUser(null);
      setError('');
    }
  };

  const handleClose = () => {
    closeLoginModal();
    // Reset for next open
    setStage('identifier');
    setIdentifier('');
    setPassword('');
    setFoundUser(null);
    setError('');
  };

  if (!isLoginModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-md transform transition-all duration-300">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent px-6 py-6 border-b border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AXIOMX</h2>
                  <p className="text-xs text-gray-400">
                    {stage === 'identifier' ? 'أدخل المعرف للمتابعة' : 'أدخل كلمة المرور'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Content - Stage based */}
          <div className="p-6 space-y-6">
            {stage === 'identifier' ? (
              // =====================================================
              // STAGE 1: IDENTIFIER INPUT
              // =====================================================
              <>
                <div>
                  <h3 className="text-lg font-semibold text-white">تسجيل الدخول</h3>
                  <p className="text-sm text-gray-400">أدخل رقم الهاتف أو المعرف للمتابعة.</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm text-gray-300">
                    <span className="mb-2 block">رقم الهاتف أو المعرف</span>
                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0b1221] px-4 py-3">
                      <User className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
                        placeholder="0501234567 أو username"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNext();
                          }
                        }}
                      />
                    </div>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
                    />
                    تذكرني
                  </label>

                  {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-white font-semibold shadow-lg shadow-blue-500/20 hover:brightness-110 transition"
                >
                  التالي
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="text-center text-sm text-gray-400">
                  ليس لديك حساب؟{' '}
                  <a href="/employee-registration" className="text-blue-400 hover:text-blue-300 transition-colors">
                    إنشاء حساب جديد
                  </a>
                </div>
              </>
            ) : (
              // =====================================================
              // STAGE 2: PASSWORD INPUT
              // =====================================================
              <>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">مرحباً</p>
                  <p className="mt-2 text-lg font-semibold text-white">{foundUser?.fullName || foundUser?.username}</p>
                  <p className="mt-1 text-sm text-gray-400">أدخل كلمة المرور لإكمال الدخول.</p>
                </div>

                <div className="space-y-4">
                  <label className="relative block text-sm text-gray-300">
                    <span className="mb-2 block">كلمة المرور</span>
                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0b1221] px-4 py-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
                        placeholder="***********"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleLogin();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </label>

                  {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}
                </div>

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
                    disabled={isLoading}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;