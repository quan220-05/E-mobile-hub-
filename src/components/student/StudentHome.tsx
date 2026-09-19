import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  Search, 
  MapPin, 
  Bike, 
  Car, 
  Zap, 
  CalendarClock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const StudentHome: React.FC = () => {
  const { 
    hubs, 
    vehicles, 
    reservations, 
    currentUser, 
    getHubStats, 
    setActiveView, 
    setSelectedHubId,
    setSelectedVehicleId,
    createVehicleReservation
  } = useApp();

  const [searchHub, setSearchHub] = useState<string>('all');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [minBattery, setMinBattery] = useState<number>(20);

  // Active reservation for current student
  const activeReservation = reservations.find(
    (r) => r.userId === currentUser.userId && (r.status === 'confirmed' || r.status === 'in-progress')
  );

  // Filter available vehicles based on criteria
  const availableVehicles = vehicles.filter((v) => {
    if (v.status !== 'available') return false;
    if (v.batteryLevel < minBattery) return false;
    if (searchHub !== 'all' && v.hubId !== searchHub) return false;
    if (searchCategory !== 'all' && v.category !== searchCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Hero Section with VinFast Branding */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Khu đô thị Đại học Quốc gia TP.HCM • Tuyến Metro Số 1</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Di Chuyển Xanh Thông Minh Cùng VinFast E-Hub
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            Mạng lưới phương tiện điện VinFast (DrgnFly, Evo 200, Feliz S, VF 3) kết nối thông minh giữa Ga Metro, Ký Túc Xá và các trường thành viên ĐHQG-HCM.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('student-vehicles')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
            >
              <Bike className="w-4 h-4" />
              <span>Đặt Xe VinFast Ngay</span>
            </button>
            <button
              onClick={() => setActiveView('student-hubs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
            >
              <MapPin className="w-4 h-4" />
              <span>Xem Bản Đồ 6 Trạm Hub</span>
            </button>
          </div>
        </div>

        {/* Decorative VinFast 'V' background accent */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 90L8 24C8 24 30 36 50 48C70 36 92 24 92 24L50 90Z" />
          </svg>
        </div>
      </div>

      {/* Active Reservation Notification Banner if exists */}
      {activeReservation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CalendarClock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                  {activeReservation.status === 'confirmed' ? 'Đang giữ chỗ (15 Phút)' : 'Chuyến đi đang diễn ra'}
                </span>
                <span className="text-xs text-blue-200">Mã: {activeReservation.reservationId}</span>
              </div>
              <h4 className="font-bold text-base mt-0.5">
                {activeReservation.hubName}
              </h4>
              <p className="text-xs text-blue-100">
                {activeReservation.status === 'confirmed'
                  ? `Mã nhận xe OTP: ${activeReservation.pickupOtp} • Hạn chót: ${new Date(activeReservation.expiresAt).toLocaleTimeString('vi-VN')}`
                  : 'Phương tiện đang lưu hành. Vui lòng hoàn trả xe về Hub khi kết thúc hành trình.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('student-reservations')}
            className="px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs transition-colors shadow-md"
          >
            {activeReservation.status === 'confirmed' ? 'Nhận Xe Ngay' : 'Quản Lý & Trả Xe'}
          </button>
        </div>
      )}

      {/* Quick Search & Filter Panel (Section 7.2) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Tìm xe nhanh theo điều kiện
          </h2>
          <span className="text-xs text-slate-500">
            Tìm thấy <strong className="text-blue-600">{availableVehicles.length}</strong> xe sẵn sàng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Select Hub */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Chọn Trạm Hub
            </label>
            <select
              value={searchHub}
              onChange={(e) => setSearchHub(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các Hub (VNU-HCM)</option>
              {hubs.map((h) => (
                <option key={h.hubId} value={h.hubId}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Vehicle Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Loại phương tiện VinFast
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả (DrgnFly, Evo, Feliz, VF 3)</option>
              <option value="electric-bike">Xe đạp trợ lực điện (DrgnFly)</option>
              <option value="electric-motorcycle">Xe máy điện (Evo 200, Feliz S, Klara S)</option>
              <option value="electric-car">Ô tô điện (VF 3, VF 5 Plus)</option>
            </select>
          </div>

          {/* Min Battery Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Pin tối thiểu
              </label>
              <span className="text-xs font-bold text-blue-600">{minBattery}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={minBattery}
              onChange={(e) => setMinBattery(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer mt-1"
            />
          </div>
        </div>
      </div>

      {/* Featured Hubs Section (Section 7.2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Trạm Hub trọng điểm tại ĐHQG-HCM
            </h3>
            <p className="text-xs text-slate-500">Giám sát sức chứa và xe sẵn có thời gian thực</p>
          </div>
          <button
            onClick={() => setActiveView('student-hubs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Xem tất cả Hub <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hubs.slice(0, 3).map((hub) => {
            const stats = getHubStats(hub.hubId);
            return (
              <div
                key={hub.hubId}
                onClick={() => setSelectedHubId(hub.hubId)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      {hub.hubId}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                      {hub.name}
                    </h4>
                  </div>
                  {stats.isNearCapacity ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Gần đầy
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Bình thường
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {hub.shortDesc}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Mức độ sử dụng chỗ:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stats.isNearCapacity ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${stats.occupancyRate}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-slate-400">Xe sẵn có</p>
                      <p className="font-bold text-xs text-blue-600">{stats.availableVehicles}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-slate-400">Chỗ trống</p>
                      <p className="font-bold text-xs text-emerald-600">{stats.availableParking}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-slate-400">Trụ sạc rảnh</p>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{stats.availableChargers}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available VinFast Fleet Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Đội xe điện VinFast sẵn sàng phục vụ
            </h3>
            <p className="text-xs text-slate-500">Mức pin &gt;= 20%, hỗ trợ giữ xe 15 phút</p>
          </div>
          <button
            onClick={() => setActiveView('student-vehicles')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Toàn bộ đội xe <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {availableVehicles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            Không tìm thấy xe phù hợp với bộ lọc hiện tại. Vui lòng hạ mức pin yêu cầu hoặc chọn Hub khác.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableVehicles.slice(0, 8).map((vehicle) => {
              const hub = hubs.find((h) => h.hubId === vehicle.hubId);
              return (
                <div
                  key={vehicle.vehicleId}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div 
                    className="relative h-36 bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                  >
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bike className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <BatteryBadge level={vehicle.batteryLevel} size="sm" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur text-white">
                        {vehicle.vinfastSeries}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 
                        onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {vehicle.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                        {hub?.name}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cước phí</span>
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                          {vehicle.rentalPricePerHour.toLocaleString('vi-VN')} đ/h
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          createVehicleReservation(vehicle.vehicleId);
                          setActiveView('student-reservations');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Đặt Xe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
