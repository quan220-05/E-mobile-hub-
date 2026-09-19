import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ReserveParkingView: React.FC = () => {
  const { 
    hubs, 
    currentUser, 
    getHubStats, 
    createParkingReservation, 
    setActiveView 
  } = useApp();

  const [selectedHubId, setSelectedHubId] = useState<string>('H01');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(180); // 3 hours default
  const [withCharging, setWithCharging] = useState<boolean>(true);
  const [vehiclePlate, setVehiclePlate] = useState<string>(currentUser.vehiclePlate || '59-B1 889.23');
  const [vehicleModel, setVehicleModel] = useState<string>(currentUser.vehicleModel || 'VinFast Feliz S (Xám)');

  const selectedHub = hubs.find((h) => h.hubId === selectedHubId);
  const stats = getHubStats(selectedHubId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = createParkingReservation(selectedHubId, startTime, durationMinutes, withCharging);
    if (success) {
      setActiveView('student-reservations');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
          <Car className="w-3.5 h-3.5" />
          <span>Dành cho Sinh viên có Xe Điện Cá Nhân (Private EV Student)</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Đặt Trước Chỗ Đậu & Lịch Sạc Xe Cá Nhân
        </h1>
        <p className="text-xs text-slate-500">
          Đảm bảo chỗ gửi xe máy điện / ô tô điện VinFast an toàn tại Hub trước khi đến trường học hoặc KTX
        </p>
      </div>

      {/* Main Reservation Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        {/* Hub Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            1. Chọn Trạm Mobility Hub
          </label>
          <select
            value={selectedHubId}
            onChange={(e) => setSelectedHubId(e.target.value)}
            className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hubs.map((h) => {
              const hStats = getHubStats(h.hubId);
              return (
                <option key={h.hubId} value={h.hubId}>
                  {h.name} — ({hStats.availableParking} chỗ trống, {hStats.availableChargers} cổng sạc rảnh)
                </option>
              );
            })}
          </select>

          {/* Hub Status Summary */}
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">{selectedHub?.location}</span>
            </div>
            {stats.availableParking <= 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Hết chỗ đỗ
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Còn {stats.availableParking} chỗ trống
              </span>
            )}
          </div>
        </div>

        {/* Time & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              2. Giờ đến dự kiến
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              3. Thời lượng đỗ xe
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={60}>1 Giờ (Cơ bản)</option>
              <option value={120}>2 Giờ (Buổi học ngắn)</option>
              <option value={180}>3 Giờ (Tiết học chuẩn)</option>
              <option value={300}>5 Giờ (Cả buổi sáng / chiều)</option>
              <option value={480}>8 Giờ (Cả ngày học / thư viện)</option>
            </select>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Biển số xe điện cá nhân
            </label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              placeholder="VD: 59-B1 889.23"
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Dòng xe VinFast
            </label>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="VD: VinFast Feliz S, Evo 200, VF 3"
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Charging Checkbox */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withCharging}
              onChange={(e) => setWithCharging(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-emerald-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                Đăng ký sạc pin thông minh VinFast trong thời gian đậu
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Hệ thống tự động xếp xe vào hàng đợi sạc tại Hub. Trụ sạc VinFast SuperSocket & Type 2 tự ngắt khi đầy 100%.
              </p>
            </div>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={stats.availableParking <= 0}
          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            stats.availableParking > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Xác Nhận Giữ Chỗ Đậu Xe (TC-07)</span>
        </button>
      </form>
    </div>
  );
};
