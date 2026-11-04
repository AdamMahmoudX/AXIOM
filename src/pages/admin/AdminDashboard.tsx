import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Shield, Mail, UserCircle, LogOut, Crown, Briefcase, Users, ShieldCheck } from 'lucide-react';

const roleIcons: Record<string, React.FC<{ className?: string }>> = {
  owner: Crown,
  admin: ShieldCheck,
  manager: Briefcase,
  employee: Users,
};

const roleColors: Record<string, string> = {
  owner: 'from-amber-500 to-orange-500',
  admin: 'from-blue-500 to-purple-500',
  manager: 'from-blue-500 to-cyan-500',
  employee: 'from-emerald-500 to-teal-500',
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, t, isRTL } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-gray-400">{t('common.loading')}</div>
      </div>
    );
  }

  const RoleIcon = roleIcons[user.role];

  const getRoleLabel = (role: string) => {
    if (role === 'owner') return t('role.owner');
    if (role === 'admin') return language === 'ar' ? 'مدير النظام' : 'Admin';
    if (role === 'manager') return t('role.manager');
    if (role === 'employee') return t('role.employee');
    return role;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img
                  src="/axiomx-logo.png"
                  alt="AXIOMX Logo"
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: '120px', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                />
              </div>
              <button
                onClick={logout}
                className={`flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-2xl">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm">
              {/* Profile Section */}
              <div className={`flex flex-col items-center mb-8 ${isRTL ? 'items-center' : 'items-center'}`}>
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${roleColors[user.role]} p-[2px] shadow-lg`}>
                    <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
                      <UserCircle className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  {/* Online indicator */}
                  <div className={`absolute -bottom-1 ${isRTL ? '-left-1' : '-right-1'} w-6 h-6 bg-green-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                {/* Username */}
                <h1 className="text-2xl font-bold text-white mb-1">{user.username}</h1>
                {user.fullName && (
                  <p className="text-gray-400 text-sm">{user.fullName}</p>
                )}
              </div>

              {/* Role Badge */}
              <div className="flex justify-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${roleColors[user.role]}/20 border border-${user.role === 'owner' ? 'amber' : user.role === 'manager' ? 'blue' : 'emerald'}-500/30`}>
                  <RoleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{getRoleLabel(user.role)}</span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid gap-4">
                {/* Email Card */}
                <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 text-start rtl:text-end">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</p>
                    <p className="text-white font-medium text-start rtl:text-end">{user.email}</p>
                  </div>
                </div>

                {/* Account Type Card */}
                <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 text-start rtl:text-end">{language === 'ar' ? 'نوع الحساب' : 'Account Role'}</p>
                    <p className="text-white font-medium capitalize text-start rtl:text-end">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                {/* User ID Card */}
                <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 text-start rtl:text-end">{language === 'ar' ? 'معرف المستخدم' : 'User ID'}</p>
                    <p className="text-white font-medium font-mono text-start rtl:text-end">#{user.id}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={logout}
                  className={`w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <LogOut className="w-5 h-5" />
                  {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                AXIOMX Admin Portal • {language === 'ar' ? 'الجلسة نشطة' : 'Session Active'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;