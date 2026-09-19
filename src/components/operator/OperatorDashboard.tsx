import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Bike, 
  Car, 
  Zap, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  PlayCircle
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const { 
    hubs, 
    vehicles, 
    parkingSpaces, 
    chargingPoints, 
    reservations, 
    chargingRequests, 
    incidents, 
    getHubStats, 
    setActiveView, 
    setSelectedHubId,
    autoScheduleCharging,
    tickSimulator
  } = useApp();

  // Summary Metrics
  const totalHubs = hubs.length;
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const inUseVehicles = vehicles.filter((v) => v.status === 'in-use').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance').length;
  const chargingVehicles = vehicles.filter((v) => v.status === 'charging' || v.status === 'waiting-for-charging').length;

  const totalParking = parkingSpaces.length;
  const availableParking = parkingSpaces.filter((p) => p.status === 'empty').length;

  const totalChargers = chargingPoints.length;
  const availableChargers = chargingPoints.filter((c) => c.status === 'available').length;
  const faultyChargers = chargingPoints.filter((c) => c.status === 'faulty').length;

  const activeReservations = reservations.filter((r) => r.status === 'confirmed' || r.status === 'in-progress').length;
  const queuedCharging = chargingRequests.filter((c) => c.status === 'queued').length;
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'in-progress').length;

  // Near Capacity Hubs
  const nearCapacityHubs = hubs.filter((h) => getHubStats(h.hubId).isNearCapacity);

  return (
    <div className="space-y-6 pb-12">
      {/* Header with quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trung Tâm Giám Sát & Điều Phối Mạng Lưới E-Mobility ĐHQG-HCM</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Bảng Điều Khiển Vận Hành (Operator Dashboard)
          </h1>
          <p className="text-xs text-slate-500">
            Giám sát thời gian thực toàn bộ 6 trạm Hub, đội xe điện VinFast, trụ sạc và các cảnh báo quá tải
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => autoScheduleCharging()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
            title="Lập lịch sạc tự động theo điểm ưu tiên"
          >
            <Zap className="w-4 h-4" />
            <span>Auto Lập Lịch Sạc</span>
          </button>
          <button
            onClick={() => setActiveView('operator-whatif')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Mô Phỏng What-If</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Hubs */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Trạm Hub</span>
            <MapPin className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalHubs}</div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Toàn khu đô thị</p>
        </div>

        {/* Vehicles Available */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Xe Sẵn Sàng</span>
            <Bike className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {availableVehicles}
            <span className="text-xs text-slate-400 font-normal"> / {totalVehicles}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {inUseVehicles} đang chạy • {maintenanceVehicles} bảo trì
          </p>
        </div>

        {/* Parking Bay Free */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Chỗ Đậu Trống</span>
            <Car className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {availableParking}
            <span className="text-xs text-slate-400 font-normal"> / {totalParking}</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            {Math.round((availableParking / totalParking) * 100)}% còn trống
          </p>
        </div>

        {/* Active Chargers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Cổng Sạc Rảnh</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {availableChargers}
            <span className="text-xs text-slate-400 font-normal"> / {totalChargers}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {faultyChargers > 0 ? (
              <span className="text-rose-500 font-bold">{faultyChargers} trụ hỏng</span>
            ) : (
              '100% hoạt động'
            )}
          </p>
        </div>

        {/* Active Reservations */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Lượt Đặt Active</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {activeReservations}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{queuedCharging} xe chờ sạc</p>
        </div>

        {/* Open Incidents */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Sự Cố Mở</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className={`text-2xl font-black ${openIncidents > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {openIncidents}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {openIncidents > 0 ? 'Cần xử lý kỹ thuật' : 'Hệ thống an toàn'}
          </p>
        </div>
      </div>

      {/* Network Overload Warnings Alert Banner */}
      {nearCapacityHubs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                Cảnh Báo: Có {nearCapacityHubs.length} trạm Hub đang chạm ngưỡng quá tải (&gt;85% Occupancy)
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                {nearCapacityHubs.map((h) => `${h.name} (${getHubStats(h.hubId).occupancyRate}%)`).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('operator-redistribution')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
          >
            Mở Điều Phối Xe
          </button>
        </div>
      )}

      {/* Hub Real-time Status Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Tình Trạng Giám Sát Chi Tiết 6 Trạm Hub
            </h3>
            <p className="text-[11px] text-slate-400">
              Cập nhật trực tiếp số liệu chỗ đỗ, trụ sạc và xe sẵn sàng
            </p>
          </div>

          <button
            onClick={() => setActiveView('operator-hubs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Xem dạng card <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Mã &amp; Tên Trạm Hub</th>
                <th className="py-3 px-3">Tỷ lệ Lấp Đầy</th>
                <th className="py-3 px-3">Xe Sẵn Có</th>
                <th className="py-3 px-3">Chỗ Đỗ Trống</th>
                <th className="py-3 px-3">Trụ Sạc Rảnh</th>
                <th className="py-3 px-3">Cảnh Báo</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hubs.map((hub) => {
                const stats = getHubStats(hub.hubId);
                return (
                  <tr key={hub.hubId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                          {hub.hubId}
                        </span>
                        <span>{hub.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{hub.location}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stats.isNearCapacity ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${stats.occupancyRate}%` }}
                          />
                        </div>
                        <span
                          className={`font-black ${
                            stats.isNearCapacity ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {stats.occupancyRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {stats.availableVehicles}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {stats.totalVehicles}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.availableParking}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {hub.totalParkingSpaces}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {stats.availableChargers}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {hub.totalChargingPoints}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      {stats.isFull ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Hết chỗ
                        </span>
                      ) : stats.isNearCapacity ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Gần đầy (&gt;85%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Bình thường
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedHubId(hub.hubId)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-blue-600 transition-colors"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
