import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VinFastLogo } from './VinFastLogo';
import { UserRole } from '../../types';
import { 
  User, 
  ShieldCheck, 
  Bike, 
  Car, 
  MapPin, 
  CalendarClock, 
  Zap, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Layers, 
  Activity, 
  AlertTriangle, 
  PlayCircle,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    userRole,
    setRole,
    activeView,
    setActiveView,
    settings,
    updateSettings,
    setIsDemoGuideOpen,
    reservations,
    incidents,
    currentUser,
    logout,
    isSimulatorRunning,
    setIsSimulatorRunning
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active reservations count for student
  const activeResCount = reservations.filter(
    (r) => r.userId === currentUser.userId && (r.status === 'confirmed' || r.status === 'in-progress')
  ).length;

  // Open incidents count for operator
  const openIncidentsCount = incidents.filter((i) => i.status === 'open' || i.status === 'in-progress').length;

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const studentNavItems = [
    { id: 'student-home', label: 'Trang chủ', icon: <Layers className="w-4 h-4" /> },
    { id: 'student-hubs', label: 'Hệ thống Hub', icon: <MapPin className="w-4 h-4" /> },
    { id: 'student-vehicles', label: 'Đội xe VinFast', icon: <Bike className="w-4 h-4" /> },
    { 
      id: 'student-reservations', 
      label: 'Lượt đặt của tôi', 
      icon: <CalendarClock className="w-4 h-4" />,
      badge: activeResCount > 0 ? activeResCount : null
    },
    { id: 'student-reserve-parking', label: 'Đặt chỗ đỗ cá nhân', icon: <Car className="w-4 h-4" /> },
    { id: 'student-charging', label: 'Đăng ký sạc', icon: <Zap className="w-4 h-4" /> },
  ];

  const operatorNavItems = [
    { id: 'operator-dashboard', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'operator-hubs', label: 'Giám sát Hub', icon: <MapPin className="w-4 h-4" /> },
    { id: 'operator-vehicles', label: 'Quản lý xe', icon: <Bike className="w-4 h-4" /> },
    { id: 'operator-charging', label: 'Lập lịch sạc', icon: <Zap className="w-4 h-4" /> },
    { id: 'operator-redistribution', label: 'Điều phối xe', icon: <Activity className="w-4 h-4" /> },
    { 
      id: 'operator-incidents', 
      label: 'Xử lý sự cố', 
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: openIncidentsCount > 0 ? openIncidentsCount : null
    },
    { id: 'operator-whatif', label: 'Mô phỏng What-If', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'operator-reports', label: 'Báo cáo', icon: <Layers className="w-4 h-4" /> },
  ];

  const currentNavItems = userRole === 'operator' ? operatorNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Subtitle */}
          <div 
            className="cursor-pointer shrink-0" 
            onClick={() => setActiveView(userRole === 'operator' ? 'operator-dashboard' : 'student-home')}
          >
            <VinFastLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
            {currentNavItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Demo Guide Script Trigger */}
            <button
              onClick={() => setIsDemoGuideOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all"
              title="Mở kịch bản 12 bước demo và danh sách Test Cases"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kịch bản Demo (12 Bước)</span>
            </button>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  userRole === 'operator'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : userRole === 'private_ev_student'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                {userRole === 'operator' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                )}
                <span className="hidden md:inline">
                  {userRole === 'operator'
                    ? 'Vận Hành (Operator)'
                    : userRole === 'private_ev_student'
                    ? 'Xe Cá Nhân'
                    : 'Sinh Viên (Student)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Role Dropdown */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn vai trò trải nghiệm
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      userRole === 'student' ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold">Student (Sinh viên)</p>
                      <p className="text-[10px] text-slate-400 font-normal">Thuê xe VinFast DrgnFly, Evo 200, Feliz S</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('private_ev_student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      userRole === 'private_ev_student' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Car className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Private EV Student</p>
                      <p className="text-[10px] text-slate-400 font-normal">Đặt trước chỗ đỗ & trạm sạc xe cá nhân</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('operator')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      userRole === 'operator' ? 'text-blue-700 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold">Operator (Ban điều hành)</p>
                      <p className="text-[10px] text-slate-400 font-normal">Điều phối xe, quản lý sạc, What-If simulator</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Chuyển đổi giao diện sáng/tối"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Settings Link */}
            <button
              onClick={() => setActiveView('settings')}
              className={`p-2 rounded-xl transition-colors ${
                activeView === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Cài đặt hệ thống"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* User Profile & Logout */}
            <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-800">
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[170px] truncate"
                title={`Đang đăng nhập: ${currentUser.name} (${currentUser.email})`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate font-semibold">{currentUser.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Đăng xuất</span>
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {currentNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Mobile User Profile & Logout */}
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{currentUser.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
