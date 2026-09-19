import React from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  X, 
  MapPin, 
  Car, 
  Zap, 
  Bike, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface HubDetailModalProps {
  hubId: string;
  onClose: () => void;
}

export const HubDetailModal: React.FC<HubDetailModalProps> = ({ hubId, onClose }) => {
  const { 
    hubs, 
    vehicles, 
    parkingSpaces, 
    chargingPoints, 
    getHubStats, 
    createVehicleReservation,
    setActiveView,
    userRole
  } = useApp();

  const hub = hubs.find((h) => h.hubId === hubId);
  if (!hub) return null;

  const stats = getHubStats(hubId);
  const hubVehicles = vehicles.filter((v) => v.hubId === hubId);
  const hubSpaces = parkingSpaces.filter((p) => p.hubId === hubId);
  const hubChargers = chargingPoints.filter((c) => c.hubId === hubId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30">
              MÃ TRẠM: {hub.hubId}
            </span>
            {stats.isNearCapacity ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Gần đầy chỗ (&gt;85%)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hoạt động tối ưu
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight">{hub.name}</h2>
          <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            {hub.location}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tỷ lệ lấp đầy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-black ${stats.isNearCapacity ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`}>
                  {stats.occupancyRate}%
                </span>
                <span className="text-[10px] text-slate-400">/ 100%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stats.isNearCapacity ? 'bg-amber-500' : 'bg-blue-600'}`}
                  style={{ width: `${stats.occupancyRate}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Chỗ đậu xe trống</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.availableParking}
                </span>
                <span className="text-xs text-slate-400">/ {hub.totalParkingSpaces}</span>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                Sẵn sàng tiếp nhận xe
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Cổng sạc sẵn sàng</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats.availableChargers}
                </span>
                <span className="text-xs text-slate-400">/ {hub.totalChargingPoints}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Hỗ trợ sạc nhanh VinFast
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Xe sẵn sàng thuê</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {stats.availableVehicles}
                </span>
                <span className="text-xs text-slate-400">/ {stats.totalVehicles} xe</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                DrgnFly, Evo 200, Feliz S
              </p>
            </div>
          </div>

          {/* Section: VinFast Fleet available at this hub */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bike className="w-4 h-4 text-blue-600" />
                Phương tiện VinFast hiện diện tại trạm ({hubVehicles.length})
              </h3>
              <span className="text-xs text-slate-500">
                Pin &gt; 20% cho phép đặt xe ngay
              </span>
            </div>

            {hubVehicles.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                Hiện không có xe tại trạm này. Điều phối viên sẽ bổ sung xe sớm.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {hubVehicles.map((v) => {
                  const isReady = v.status === 'available' && v.batteryLevel >= 20;
                  return (
                    <div
                      key={v.vehicleId}
                      className={`p-3 rounded-xl border transition-all ${
                        isReady
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {v.vinfastSeries}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {v.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">Biển số: {v.licensePlate}</p>
                        </div>
                        <BatteryBadge level={v.batteryLevel} isCharging={v.status === 'charging'} size="sm" />
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {v.rentalPricePerHour.toLocaleString('vi-VN')} đ/h
                        </span>

                        {isReady ? (
                          <button
                            onClick={() => {
                              createVehicleReservation(v.vehicleId);
                              onClose();
                              setActiveView('student-reservations');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors shadow-sm"
                          >
                            Đặt Xe
                          </button>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {v.status === 'maintenance' ? 'Bảo trì' : v.status === 'waiting-for-charging' ? 'Chờ sạc' : 'Đang thuê'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Charging Bays status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Trụ sạc VinFast thông minh ({hubChargers.length} cổng sạc)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {hubChargers.map((cp) => (
                <div
                  key={cp.pointId}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{cp.code}</p>
                    <p className="text-[10px] text-slate-500">{cp.connectorType}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cp.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : cp.status === 'charging'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 animate-pulse'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {cp.status === 'available' ? 'Sẵn sàng' : cp.status === 'charging' ? 'Đang sạc' : 'Báo lỗi'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Parking Bays Layout */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              Sơ đồ ô đậu xe (Bays Grid)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
              {hubSpaces.map((slot) => (
                <div
                  key={slot.spaceId}
                  className={`p-2 rounded-lg text-center border text-[10px] font-bold ${
                    slot.status === 'empty'
                      ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : slot.status === 'reserved'
                      ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                      : 'border-slate-300 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div>{slot.code}</div>
                  <div className="text-[9px] font-normal opacity-80">
                    {slot.status === 'empty' ? 'Trống' : slot.status === 'reserved' ? 'Đã giữ' : 'Có xe'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Trạm Hub mở cửa 24/7. Hỗ trợ kỹ thuật: 1900 23 23 89.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setActiveView('student-reserve-parking');
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors"
            >
              Đặt Chỗ Đậu Cá Nhân
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveView('student-charging');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-colors shadow-sm"
            >
              Đăng Ký Sạc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
