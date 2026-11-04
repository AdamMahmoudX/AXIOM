import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarCollapsed, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isRTL = language === 'ar';

  // Handle language switch with URL update
  const handleLanguageSwitch = (targetLang: 'en' | 'ar') => {
    const currentPath = location.pathname + location.search + location.hash;

    let newPath: string;
    if (targetLang === 'ar') {
      // Add /ar prefix
      const pathWithoutAr = currentPath.replace(/^\/ar/, '');
      newPath = pathWithoutAr === '/' || pathWithoutAr === '' ? '/ar' : `/ar${pathWithoutAr}`;
    } else {
      // Remove /ar prefix
      newPath = currentPath.replace(/^\/ar/, '') || '/';
    }

    setLanguage(targetLang);
    navigate(newPath);
  };

  const notifications = [
    { id: 1, title: t('admin.notification.newProject'), time: '5 ' + t('admin.minAgo'), unread: true },
    { id: 2, title: t('admin.notification.teamJoined'), time: '1 ' + t('admin.hourAgo'), unread: true },
    { id: 3, title: t('admin.notification.systemUpdated'), time: '2 ' + t('admin.hoursAgo'), unread: false },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
      <div className={`h-full px-4 lg:px-6 flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Left side (or right in RTL) */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sidebar toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            ) : (
              <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Date & Time */}
          <div className="hidden md:block">
            <p className="text-sm text-white font-medium">{formatDate(currentTime)}</p>
            <p className="text-xs text-gray-500">{formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Right side (or left in RTL) */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language toggle */}
          <button
            onClick={() => handleLanguageSwitch(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all"
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className={`absolute top-1 ${isRTL ? 'left-1' : 'right-1'} w-4 h-4 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50`}>
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">
                    {t('admin.notifications')}
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white text-start">{notification.title}</p>
                          <p className="text-xs text-gray-500 text-start">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/5">
                  <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    {t('admin.viewAll')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className={`hidden md:block text-start ${isRTL ? 'text-end' : 'text-start'}`}>
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block ${isRTL ? 'rotate-90' : ''}`} />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50`}>
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4" />
                    {t('admin.profile')}
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Settings className="w-4 h-4" />
                    {t('admin.settings')}
                  </button>
                </div>
                <div className="border-t border-white/5 py-2">
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <LogOut className="w-4 h-4" />
                    {t('admin.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;