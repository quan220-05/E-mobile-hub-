import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VinFastLogo } from './VinFastLogo';
import { UserRole } from '../../types';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Bike, 
  Car, 
  Zap, 
  Sun, 
  Moon,
  Info,
  Building2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, settings, updateSettings } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rolePreference, setRolePreference] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate on the fly
  const cleanId = identifier.trim().toLowerCase();
  const isAdminInput = cleanId === 'admin' || cleanId === 'admin@hcmut.edu.vn';
  const isHcmutEmail = cleanId.endsWith('@hcmut.edu.vn');
  const isValidFormat = isAdminInput || isHcmutEmail;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = login({
      identifier,
      password,
      rolePreference: isAdminInput ? 'operator' : rolePreference,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (presetId: string, presetPass: string, role: UserRole) => {
    setErrorMessage(null);
    setIdentifier(presetId);
    setPassword(presetPass);
    setRolePreference(role);

    login({
      identifier: presetId,
      password: presetPass,
      rolePreference: role,
    });
  };

  const appendHcmutDomain = () => {
    if (!identifier) {
      setIdentifier('sinhvien@hcmut.edu.vn');
      return;
    }
    const clean = identifier.split('@')[0];
    setIdentifier(`${clean}@hcmut.edu.vn`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header Bar */}
      <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <VinFastLogo size="md" />
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Trường ĐH Bách Khoa - ĐHQG-HCM (HCMUT)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Đổi giao diện sáng/tối"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-blue-950/5 p-6 sm:p-8 space-y-6 backdrop-blur-sm">
            {/* Title & Introduction */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cổng Xác Thực Điện Tử VinFast Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Đăng Nhập Hệ Thống
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Hệ thống điều phối xe điện &amp; trạm sạc thông minh phục vụ cộng đồng sinh viên, giảng viên Trường Đại học Bách Khoa (HCMUT)
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold">Đăng nhập không thành công</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Identifier / Email Field */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Tài khoản / Email Bách Khoa</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    Yêu cầu đuôi @hcmut.edu.vn
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="vidu: an.nguyen@hcmut.edu.vn hoặc admin"
                    className={`w-full pl-10 pr-24 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white transition-all focus:outline-hidden focus:ring-2 ${
                      identifier && !isValidFormat
                        ? 'border-amber-400 focus:ring-amber-400/30'
                        : identifier && isValidFormat
                        ? 'border-emerald-500 focus:ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/30'
                    }`}
                  />
                  {/* Append domain button or status check */}
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    {identifier && !identifier.includes('@') && identifier.toLowerCase() !== 'admin' && (
                      <button
                        type="button"
                        onClick={appendHcmutDomain}
                        className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors"
                        title="Thêm đuôi @hcmut.edu.vn tự động"
                      >
                        +@hcmut.edu.vn
                      </button>
                    )}
                    {isValidFormat && (
                      <span className="p-1 text-emerald-600 dark:text-emerald-400" title="Định dạng hợp lệ">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Validation Note */}
                {identifier && !isValidFormat && (
                  <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>Email phải có đuôi <strong>@hcmut.edu.vn</strong> hoặc tài khoản quản trị <strong>admin</strong>.</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Mật khẩu</span>
                  {isAdminInput && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Mật khẩu admin mặc định: <strong>admin</strong>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={isAdminInput ? 'Nhập mật khẩu: admin' : 'Nhập mật khẩu của bạn'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Option when logging in as student */}
              {!isAdminInput && (
                <div className="space-y-1.5 pt-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Mục đích sử dụng chính tại trạm:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRolePreference('student')}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        rolePreference === 'student'
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Bike className="w-4 h-4 text-blue-600" />
                        <span>Thuê Xe Dùng Chung</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        VinFast DrgnFly, Evo 200, Feliz S
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRolePreference('private_ev_student')}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        rolePreference === 'private_ev_student'
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Car className="w-4 h-4 text-emerald-600" />
                        <span>Xe Điện Cá Nhân</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Đặt chỗ đỗ &amp; Lịch sạc ưu tiên
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Vào VinFast Hub'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tài khoản mẫu thử nghiệm (Quick Demo)
              </span>
              <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Quick Demo Preset Buttons */}
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Bấm vào tài khoản bên dưới để tự động điền và đăng nhập ngay:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Admin / Operator Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin', 'operator')}
                  className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Admin Vận Hành</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                    user: <strong>admin</strong>
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    pass: <strong>admin</strong>
                  </p>
                </button>

                {/* Student Shared EV Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('an.nguyen@hcmut.edu.vn', '123456', 'student')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>SV Thuê Xe</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    an.nguyen@hcmut.edu.vn
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Đã kiểm chứng BK
                  </p>
                </button>

                {/* Student Private EV Preset */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('mai.tran@hcmut.edu.vn', '123456', 'private_ev_student')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SV Xe Cá Nhân</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    mai.tran@hcmut.edu.vn
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Xe Feliz S
                  </p>
                </button>
              </div>
            </div>

            {/* Instructions box */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Quy định xác thực hệ thống:</span>
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>
                  Chỉ các tài khoản email có đuôi <strong>@hcmut.edu.vn</strong> mới được cấp quyền sinh viên/giảng viên.
                </li>
                <li>
                  Tài khoản Quản trị viên (Admin): tạm thời sử dụng tên đăng nhập <strong>admin</strong> và mật khẩu <strong>admin</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60">
        <p>
          © 2026 VinFast Auto &amp; Trường Đại học Bách Khoa - ĐHQG-HCM. Hợp tác phát triển hạ tầng giao thông xanh học đường.
        </p>
      </footer>
    </div>
  );
};
