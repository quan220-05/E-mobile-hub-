import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  Zap, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  SlidersHorizontal, 
  Wrench, 
  Calculator,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const ChargingManagementView: React.FC = () => {
  const { 
    chargingRequests, 
    chargingPoints, 
    hubs, 
    autoScheduleCharging, 
    toggleChargingPointStatus,
    cancelChargingRequest 
  } = useApp();

  const [selectedHub, setSelectedHub] = useState('all');

  const filteredPoints = chargingPoints.filter((p) => {
    if (selectedHub !== 'all' && p.hubId !== selectedHub) return false;
    return true;
  });

  const queuedRequests = chargingRequests.filter((r) => r.status === 'queued');
  const activeChargingRequests = chargingRequests.filter((r) => r.status === 'charging');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1.5">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            <span>Thuật Toán Phân Phối Sạc Đa Tiêu Chí Chuẩn VinFast</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Quản Lý &amp; Lập Lịch Sạc Thông Minh (Smart Charging)
          </h1>
          <p className="text-xs text-slate-500">
            Tự động chấm điểm ưu tiên, tối ưu công suất lưới và tự động gắn xe vào trụ sạc trống
          </p>
        </div>

        <button
          onClick={() => autoScheduleCharging()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tự Động Lập Lịch Sạc (TC-09)</span>
        </button>
      </div>

      {/* Formula Explanation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">
              Công Thức Chấm Điểm Ưu Tiên (Priority Score Formula)
            </h4>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              Priority Score = (100 - pin) × 0.6 + UrgencyFactor × 0.3 + HubPressure × 0.1
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 hidden sm:block">
          <div>Trọng số pin thấp: <strong>60%</strong></div>
          <div>Khung giờ cấp thiết: <strong>30%</strong> • Tải trạm: <strong>10%</strong></div>
        </div>
      </div>

      {/* Charging Requests Waiting Queue (TC-09, TC-10) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Hàng Đợi Chờ Lập Lịch Sạc ({queuedRequests.length} xe đang chờ)
            </h3>
            <p className="text-[11px] text-slate-400">
              Các xe có pin thấp &lt;20% và yêu cầu của sinh viên xếp hạng theo điểm ưu tiên
            </p>
          </div>
        </div>

        {queuedRequests.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            Hàng đợi sạc hiện đang trống. Toàn bộ xe đã được gán trụ sạc hoặc pin ổn định.
          </div>
        ) : (
          <div className="space-y-2.5">
            {queuedRequests.map((req, idx) => {
              const hub = hubs.find((h) => h.hubId === req.hubId);
              return (
                <div
                  key={req.requestId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </div>

                    <BatteryBadge level={req.batteryLevel} size="sm" />

                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{req.vehicleModel}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({req.vehiclePlate})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {hub?.name} • Mục tiêu: sạc tới {req.targetBattery}% • {req.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Priority Score</span>
                      <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                        {req.priorityScore} điểm
                      </span>
                    </div>

                    <button
                      onClick={() => cancelChargingRequest(req.requestId)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-slate-500 text-[11px] transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charging Points Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              Hệ Thống Trụ Sạc Toàn Mạng Lưới ({chargingPoints.length} Cổng Sạc)
            </h3>
            <p className="text-[11px] text-slate-400">
              Trụ AC Type 2 (7.4kW - 11kW), VinFast SuperSocket (3.3kW), và Trụ sạc nhanh DC (30kW - 60kW)
            </p>
          </div>

          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả Trạm Hub</option>
            {hubs.map((h) => (
              <option key={h.hubId} value={h.hubId}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredPoints.map((point) => {
            const isAvail = point.status === 'available';
            const isOccupied = point.status === 'charging';
            const isFaulty = point.status === 'faulty';

            return (
              <div
                key={point.pointId}
                className={`p-3.5 rounded-xl border transition-all ${
                  isOccupied
                    ? 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20'
                    : isFaulty
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {point.pointId}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{point.hubId} • {point.powerRate} kW</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isOccupied
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : isFaulty
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isOccupied ? 'Đang sạc' : isFaulty ? 'Lỗi' : 'Sẵn sàng'}
                  </span>
                </div>

                <div className="mt-2 text-xs">
                  {isOccupied ? (
                    <div className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-blue-500" />
                      Xe: {point.currentVehicleId || 'Đang sạc'}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px]">Cổng trống, sẵn sàng cấp điện</div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{point.connectorType}</span>
                  <button
                    onClick={() => toggleChargingPointStatus(point.pointId)}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {isFaulty ? 'Bật lại' : 'Báo bảo trì'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
