import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  RotateCcw, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Sparkles, 
  TrendingDown, 
  TrendingUp,
  Bike
} from 'lucide-react';

export const RedistributionView: React.FC = () => {
  const { hubs, vehicles, getHubStats, redistributeVehicle } = useApp();

  const [fromHubId, setFromHubId] = useState<string>('H03'); // KTX Khu B
  const [toHubId, setToHubId] = useState<string>('H01'); // Ga Metro
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  // Vehicles available at fromHub
  const availableAtSource = vehicles.filter((v) => v.hubId === fromHubId && v.status === 'available');

  const toggleVehicleSelect = (id: string) => {
    if (selectedVehicleIds.includes(id)) {
      setSelectedVehicleIds(selectedVehicleIds.filter((v) => v !== id));
    } else {
      setSelectedVehicleIds([...selectedVehicleIds, id]);
    }
  };

  const handleExecuteTransfer = () => {
    if (selectedVehicleIds.length === 0) return;
    selectedVehicleIds.forEach((vid) => {
      redistributeVehicle(vid, toHubId);
    });
    setSelectedVehicleIds([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1.5">
          <Truck className="w-3.5 h-3.5" />
          <span>Cân Bằng Đội Xe (Fleet Rebalancing Algorithm)</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Điều Phối Xe Giữa Các Trạm Hub (Redistribution)
        </h1>
        <p className="text-xs text-slate-500">
          Chủ động điều chuyển xe điện VinFast từ trạm dư thừa sang trạm có nhu cầu cao (như Ga Metro giờ cao điểm sáng)
        </p>
      </div>

      {/* Rebalancing Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Source Hub Analysis */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              1. Trạm Nguồn (Xuất Xe)
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              {availableAtSource.length} xe sẵn có
            </span>
          </div>

          <select
            value={fromHubId}
            onChange={(e) => {
              setFromHubId(e.target.value);
              setSelectedVehicleIds([]);
            }}
            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            {hubs.map((h) => {
              const s = getHubStats(h.hubId);
              return (
                <option key={h.hubId} value={h.hubId}>
                  {h.name} ({s.availableVehicles} xe rảnh)
                </option>
              );
            })}
          </select>

          {/* Vehicle Selection checkboxes */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Chọn xe muốn điều chuyển:
            </span>
            {availableAtSource.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Trạm này hiện không có xe rảnh để chuyển đi.</p>
            ) : (
              availableAtSource.map((v) => (
                <label
                  key={v.vehicleId}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    selectedVehicleIds.includes(v.vehicleId)
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedVehicleIds.includes(v.vehicleId)}
                      onChange={() => toggleVehicleSelect(v.vehicleId)}
                      className="rounded accent-blue-600"
                    />
                    <span>{v.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({v.licensePlate})</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">Pin {v.batteryLevel}%</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Target Hub Analysis */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                2. Trạm Đích (Nhận Xe)
              </span>
              <span className="text-[11px] font-bold text-blue-600">
                {getHubStats(toHubId).availableParking} chỗ trống
              </span>
            </div>

            <select
              value={toHubId}
              onChange={(e) => setToHubId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              {hubs.map((h) => {
                const s = getHubStats(h.hubId);
                return (
                  <option key={h.hubId} value={h.hubId}>
                    {h.name} ({s.availableParking} chỗ đỗ trống)
                  </option>
                );
              })}
            </select>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trạm đích hiện tại:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {hubs.find((h) => h.hubId === toHubId)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tỷ lệ lấp đầy:</span>
                <span className="font-bold text-blue-600">
                  {getHubStats(toHubId).occupancyRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số xe đã chọn chuyển:</span>
                <span className="font-black text-sm text-emerald-600">
                  {selectedVehicleIds.length} xe
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteTransfer}
            disabled={selectedVehicleIds.length === 0 || fromHubId === toHubId}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              selectedVehicleIds.length > 0 && fromHubId !== toHubId
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Thực Hiện Điều Chuyển ({selectedVehicleIds.length} Xe)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
