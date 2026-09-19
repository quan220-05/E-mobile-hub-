import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  Zap, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ListOrdered, 
  Sparkles, 
  X 
} from 'lucide-react';

export const ChargingRequestView: React.FC = () => {
  const { 
    hubs, 
    chargingRequests, 
    createChargingRequest, 
    cancelChargingRequest, 
    currentUser,
    getHubStats 
  } = useApp();

  const [hubId, setHubId] = useState<string>('H01');
  const [vehicleModel, setVehicleModel] = useState<string>(currentUser.vehicleModel || 'VinFast Evo 200');
  const [vehiclePlate, setVehiclePlate] = useState<string>(currentUser.vehiclePlate || '59-B1 668.99');
  const [batteryLevel, setBatteryLevel] = useState<number>(20);
  const [targetBattery, setTargetBattery] = useState<number>(90);
  const [timeSlot, setTimeSlot] = useState<string>('Khung giờ 08:00 - 10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChargingRequest(
      hubId,
      'PVT-' + Math.floor(1000 + Math.random() * 9000),
      vehiclePlate,
      vehicleModel,
      batteryLevel,
      targetBattery,
      timeSlot
    );
  };

  const hubStats = getHubStats(hubId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Hệ Thống Đăng Ký & Lập Lịch Sạc VinFast E-Hub
        </h1>
        <p className="text-xs text-slate-500">
          Thuật toán chấm điểm ưu tiên sạc thông minh: Xe pin thấp và nhu cầu cấp thiết được phục vụ trước
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              Đăng Ký Yêu Cầu Sạc Mới
            </h3>

            {/* Hub Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Chọn Trạm Sạc Hub
              </label>
              <select
                value={hubId}
                onChange={(e) => setHubId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {hubs.map((h) => {
                  const s = getHubStats(h.hubId);
                  return (
                    <option key={h.hubId} value={h.hubId}>
                      {h.name} ({s.availableChargers} cổng sạc rảnh)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Vehicle Model & Plate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Dòng xe VinFast
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Biển kiểm soát
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Current Battery Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-slate-500 font-semibold">Mức pin hiện tại:</span>
                <span className={`font-black ${batteryLevel < 20 ? 'text-rose-500' : 'text-blue-600'}`}>
                  {batteryLevel}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                *Pin càng thấp điểm ưu tiên sạc càng cao (Công thức chuẩn VNU E-Hub).
              </span>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Khung giờ sạc mong muốn
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="Ngay khi có trụ sạc rảnh">Ngay khi có trụ sạc rảnh (Ưu tiên)</option>
                <option value="Khung giờ 08:00 - 10:00">Khung giờ 08:00 - 10:00 (Sáng sớm)</option>
                <option value="Khung giờ 10:00 - 12:00">Khung giờ 10:00 - 12:00 (Buổi trưa)</option>
                <option value="Khung giờ 13:00 - 15:00">Khung giờ 13:00 - 15:00 (Đầu giờ chiều)</option>
                <option value="Khung giờ 17:00 - 19:00">Khung giờ 17:00 - 19:00 (Tan học về KTX)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Gửi Yêu Cầu Sạc</span>
            </button>
          </form>
        </div>

        {/* Right Live Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-blue-600" />
                  Hàng Đợi & Tiến Trình Sạc Toàn Mạng Lưới ({chargingRequests.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sắp xếp tự động theo điểm ưu tiên Priority Score
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {chargingRequests.map((req) => {
                const isCharging = req.status === 'charging';
                const isQueued = req.status === 'queued';
                const isScheduled = req.status === 'scheduled';
                const isCompleted = req.status === 'completed';

                return (
                  <div
                    key={req.requestId}
                    className={`p-3.5 rounded-xl border text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCharging
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : isQueued
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                        : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <BatteryBadge level={req.batteryLevel} isCharging={isCharging} size="sm" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{req.vehicleModel}</span>
                          <span className="text-[11px] text-slate-500">({req.vehiclePlate})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                          {req.hubName} • {req.timeSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Điểm ưu tiên</span>
                        <span className="font-black text-xs text-blue-600 dark:text-blue-400">
                          {req.priorityScore} đ
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCharging
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
                              : isQueued
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isCharging ? 'Đang sạc' : isQueued ? 'Đang chờ' : req.status}
                        </span>
                      </div>

                      {isQueued && (
                        <button
                          onClick={() => cancelChargingRequest(req.requestId)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Hủy yêu cầu sạc"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
