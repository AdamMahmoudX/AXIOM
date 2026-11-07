import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFilteredMenuItems } from '../types/permissions';
import {
  LayoutDashboard,
  FolderKanban,
  Boxes,
  Tag,
  FileText,
  Users,
  Mail,
  MessageSquare,
  Paperclip,
  Settings,
  Shield,
  Activity,
  Search,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  FolderKanban,
  Boxes,
  Tag,
  FileText,
  Users,
  Mail,
  MessageSquare,
  Paperclip,
  Settings,
  Shield,
  Activity,
  Search,
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Get filtered menu items based on user role
  const menuItems = user?.role ? getFilteredMenuItems(user.role, user.serviceRole) : [];
  const adminPrefix = location.pathname.startsWith('/ar/admin') ? '/ar/admin' : '/admin';

  const sidebarContent = (
    <div
      className={`fixed top-0 h-screen bg-[#0a0a0a] border-white/10 flex flex-col z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } ${isRTL ? 'right-0 border-s' : 'left-0 border-e'} ${
        mobileOpen
          ? `${isRTL ? 'translate-x-0' : 'translate-x-0'} lg:translate-x-0`
          : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img
              src="/axiomx-logo.png"
              alt="AXIOMX Logo"
              className="h-8 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
            />
            <span className="text-sm font-bold text-blue-400">AXIOMX</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <img
              src="/axiomx-logo.png"
              alt="AXIOMX Logo"
              className="h-8 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const route = item.route.replace(/^\/admin/, adminPrefix);
            const isActive =
              location.pathname === route ||
              (route !== adminPrefix && location.pathname.startsWith(`${route}/`));

            return (
              <li key={item.id}>
                <Link
                  to={route}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1">
                      {language === 'ar' ? item.labelAr : item.label}
                    </span>
                  )}
                  {isActive && (
                    <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full ${isRTL ? 'left-auto right-0' : 'left-0 right-auto'}`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with user info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      {sidebarContent}

      {/* Desktop collapsed indicator - removed toggle button as it's in header */}
    </>
  );
};

export default Sidebar;