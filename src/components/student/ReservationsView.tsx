import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Reservation, Hub } from '../../types';
import { 
  CalendarClock, 
  Bike, 
  Car, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  QrCode, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const { 
    reservations, 
    vehicles, 
    hubs, 
    currentUser, 
    pickupVehicle, 
    returnVehicle, 
    cancelReservation,
    getHubStats,
    setActiveView 
  } = useApp();

  const [pickupModalReservation, setPickupModalReservation] = useState<Reservation | null>(null);
  const [returnModalReservation, setReturnModalReservation] = useState<Reservation | null>(null);
  const [selectedReturnHubId, setSelectedReturnHubId] = useState<string>('H01');
  const [returnError, setReturnError] = useState<{ message: string; alternativeHub?: Hub } | null>(null);

  // Filter reservations for current user
  const userReservations = reservations.filter((r) => r.userId === currentUser.userId);

  // Real-time remaining countdown state for active bookings
  const [nowTime, setNowTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePickupConfirm = () => {
    if (!pickupModalReservation) return;
    pickupVehicle(pickupModalReservation.reservationId);
    setPickupModalReservation(null);
  };

  const handleReturnConfirm = () => {
    if (!returnModalReservation) return;
    const result = returnVehicle(returnModalReservation.reservationId, selectedReturnHubId);
    if (!result.success) {
      setReturnError({
        message: result.message,
        alternativeHub: result.alternativeHub,
      });
    } else {
      setReturnModalReservation(null);
      setReturnError(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Quản Lý Đặt Chỗ Của Tôi
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi trạng thái giữ xe (15 phút), lịch sử nhận và trả xe điện VinFast
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('student-vehicles')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            + Đặt Thêm Xe Mới
          </button>
        </div>
      </div>

      {/* Reservations List */}
      {userReservations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
            <CalendarClock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Bạn chưa có lượt đặt xe hoặc chỗ đậu nào
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hãy khám phá đội xe VinFast DrgnFly, Evo 200, Feliz S hoặc đặt trước chỗ đỗ xe tại các Hub quanh làng đại học.
          </p>
          <button
            onClick={() => setActiveView('student-vehicles')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
          >
            Khám phá đội xe ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userReservations.map((res) => {
            const vehicle = vehicles.find((v) => v.vehicleId === res.vehicleId);
            const hub = hubs.find((h) => h.hubId === res.hubId);
            const isConfirmed = res.status === 'confirmed';
            const isInProgress = res.status === 'in-progress';
            const isCompleted = res.status === 'completed';
            const isCancelled = res.status === 'cancelled';
            const isExpired = res.status === 'expired';

            // Calculate remaining seconds for countdown
            const expiresTimestamp = new Date(res.expiresAt).getTime();
            const remainingSec = Math.max(0, Math.floor((expiresTimestamp - nowTime) / 1000));
            const remainingMins = Math.floor(remainingSec / 60);
            const remainingSecsMod = remainingSec % 60;

            return (
              <div
                key={res.reservationId}
                className={`p-5 rounded-2xl border transition-all ${
                  isConfirmed
                    ? 'border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm'
                    : isInProgress
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        res.type === 'vehicle'
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {res.type === 'vehicle' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                          {res.reservationId}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {res.type === 'vehicle' ? 'Thuê Xe Dùng Chung' : 'Chỗ Đậu Xe Cá Nhân'}
                        </span>

                        {/* Status badge */}
                        {isConfirmed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Đang giữ chỗ
                          </span>
                        )}
                        {isInProgress && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            Đang di chuyển
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Đã hoàn tất
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Đã hủy
                          </span>
                        )}
                        {isExpired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            Đã hết hạn
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : `Chỗ đỗ ${res.spaceId || 'tiêu chuẩn'}`}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        {res.hubName}
                      </p>
                    </div>
                  </div>

                  {/* Middle: 15-Minute Countdown for Confirmed */}
                  {isConfirmed && res.type === 'vehicle' && (
                    <div className="p-3 rounded-xl bg-blue-100/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-center">
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 block">
                        Thời gian giữ xe còn lại
                      </span>
                      <span className="text-base font-black text-blue-800 dark:text-blue-200 font-mono">
                        {String(remainingMins).padStart(2, '0')}:{String(remainingSecsMod).padStart(2, '0')}
                      </span>
                      {res.pickupOtp && (
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                          Mã OTP: <strong>{res.pickupOtp}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {isConfirmed && res.type === 'vehicle' && (
                      <>
                        <button
                          onClick={() => setPickupModalReservation(res)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Nhận Xe (Pickup)</span>
                        </button>
                        <button
                          onClick={() => cancelReservation(res.reservationId)}
                          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    )}

                    {isInProgress && res.type === 'vehicle' && (
                      <button
                        onClick={() => {
                          setReturnModalReservation(res);
                          setSelectedReturnHubId(res.hubId);
                          setReturnError(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Trả Xe Về Hub (Return)</span>
                      </button>
                    )}

                    {isConfirmed && res.type === 'parking' && (
                      <button
                        onClick={() => cancelReservation(res.reservationId)}
                        className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Hủy Lịch Đậu Xe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pickup Modal (TC-03, TC-04) */}
      {pickupModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Xác Nhận Nhận Xe VinFast
              </h3>
              <p className="text-xs text-slate-500">
                Mã đặt chỗ: {pickupModalReservation.reservationId} • Trạm: {pickupModalReservation.hubName}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mã xác thực OTP mở khóa:</span>
                <span className="font-mono font-black text-sm text-blue-600">
                  {pickupModalReservation.pickupOtp || 'VF-8888'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hạn nhận xe (15 phút):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(pickupModalReservation.expiresAt).toLocaleTimeString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kiểm tra mũ bảo hiểm:</span>
                <span className="font-semibold text-emerald-600">Đã trang bị sẵn 02 mũ</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Nhấn &quot;Xác nhận nhận xe&quot; để mở khóa xe và chuyển trạng thái sang <strong>in-use</strong>.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setPickupModalReservation(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={handlePickupConfirm}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md transition-colors"
              >
                Xác Nhận Nhận Xe (TC-03)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal (TC-05, TC-06) */}
      {returnModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Hoàn Trả Phương Tiện Về Hub
              </h3>
              <p className="text-xs text-slate-500">
                Chọn trạm Hub để đỗ xe và kết thúc chuyến đi
              </p>
            </div>

            {/* Hub Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Chọn Trạm Hub trả xe
              </label>
              <select
                value={selectedReturnHubId}
                onChange={(e) => {
                  setSelectedReturnHubId(e.target.value);
                  setReturnError(null);
                }}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {hubs.map((h) => {
                  const stats = getHubStats(h.hubId);
                  return (
                    <option key={h.hubId} value={h.hubId}>
                      {h.name} ({stats.availableParking} chỗ trống)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Hub Capacity Alert */}
            {(() => {
              const targetStats = getHubStats(selectedReturnHubId);
              return (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tình trạng chỗ đỗ trạm:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {targetStats.availableParking} / {hubs.find((h) => h.hubId === selectedReturnHubId)?.totalParkingSpaces} chỗ trống
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tỷ lệ lấp đầy:</span>
                    <span className={`font-bold ${targetStats.isNearCapacity ? 'text-amber-500' : 'text-blue-600'}`}>
                      {targetStats.occupancyRate}%
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Return Error / Full Hub Handling (TC-06) */}
            {returnError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 space-y-2 animate-in shake">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Không thể hoàn trả tại trạm này (TC-06)</p>
                    <p className="text-[11px] mt-0.5">{returnError.message}</p>
                  </div>
                </div>

                {returnError.alternativeHub && (
                  <button
                    onClick={() => {
                      if (returnError.alternativeHub) {
                        setSelectedReturnHubId(returnError.alternativeHub.hubId);
                        setReturnError(null);
                      }
                    }}
                    className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Chuyển sang gợi ý: {returnError.alternativeHub.name}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              *Hệ thống tự động kiểm tra pin. Nếu pin xe dưới 20%, hệ thống tự động xếp xe vào hàng đợi sạc ưu tiên thông minh.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setReturnModalReservation(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={handleReturnConfirm}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition-colors"
              >
                Xác Nhận Trả Xe (TC-05)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
