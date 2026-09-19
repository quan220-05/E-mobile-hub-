import React from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  X, 
  Bike, 
  MapPin, 
  Zap, 
  Gauge, 
  Clock, 
  ShieldCheck, 
  Info,
  CalendarCheck
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicleId: string;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicleId, onClose }) => {
  const { vehicles, hubs, createVehicleReservation, setActiveView } = useApp();

  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
  if (!vehicle) return null;

  const hub = hubs.find((h) => h.hubId === vehicle.hubId);
  const isAvailable = vehicle.status === 'available';
  const hasEnoughBattery = vehicle.batteryLevel >= 20;
  const canBook = isAvailable && hasEnoughBattery;

  const handleBook = () => {
    const success = createVehicleReservation(vehicle.vehicleId);
    if (success) {
      onClose();
      setActiveView('student-reservations');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header with image */}
        <div className="relative h-48 bg-slate-900 overflow-hidden">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
              <Bike className="w-16 h-16 text-blue-400 opacity-60" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white p-2 rounded-xl bg-black/40 hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                {vehicle.vinfastSeries}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{vehicle.name}</h3>
              <p className="text-xs text-slate-300">Biển số: {vehicle.licensePlate} • Màu: {vehicle.color}</p>
            </div>
            <BatteryBadge level={vehicle.batteryLevel} isCharging={vehicle.status === 'charging'} size="md" />
          </div>
        </div>

        {/* Specs body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
              <Gauge className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">Tốc độ tối đa</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.maxSpeed} km/h</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
              <Zap className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">Tầm hoạt động</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">~{vehicle.rangeKm} km</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
              <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">Động cơ</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={vehicle.motorPower}>
                {vehicle.motorPower}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Trạm đỗ hiện tại:</span>
              <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {hub?.name || 'VinFast Hub'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cước thuê sinh viên:</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                {vehicle.rentalPricePerHour.toLocaleString('vi-VN')} đ/giờ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Thời hạn giữ chỗ:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                15 phút kể từ khi xác nhận
              </span>
            </div>
          </div>

          {!canBook && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Phương tiện không sẵn sàng đặt</p>
                <p className="text-[11px] mt-0.5">
                  {!hasEnoughBattery
                    ? 'Mức pin xe dưới 20%. Xe đang được đưa vào danh sách chờ sạc pin.'
                    : `Xe hiện đang ở trạng thái: ${vehicle.status}.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>

          <button
            onClick={handleBook}
            disabled={!canBook}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              canBook
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Xác Nhận Đặt Xe (15 Phút)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
