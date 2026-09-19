import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatIfParameters, WhatIfResult } from '../../types';
import { 
  Play, 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  TrendingUp, 
  Zap, 
  Bike, 
  Send,
  Layers,
  ArrowRight
} from 'lucide-react';

export const WhatIfSimulationView: React.FC = () => {
  const { hubs, runWhatIfSimulation, applyWhatIfRecommendation, getHubStats } = useApp();

  // Presets based on Section 7.18 & TC-11, TC-12
  const presets: { id: string; label: string; params: WhatIfParameters }[] = [
    {
      id: 'metro-surge',
      label: 'Kịch bản 1: Giờ cao điểm sáng tại Ga Metro ĐHQG (+50 Sinh Viên)',
      params: {
        hubId: 'H01',
        additionalUsers: 50,
        sharedVehicleUsageRate: 0.7, // 70%
        brokenChargerPercent: 0,
        timeWindow: '07:00 - 08:30 (Cao điểm sáng)',
      },
    },
    {
      id: 'charger-failure',
      label: 'Kịch bản 2: 50% Trụ sạc KTX Khu A gặp sự cố lưới điện',
      params: {
        hubId: 'H02',
        additionalUsers: 25,
        sharedVehicleUsageRate: 0.4,
        brokenChargerPercent: 50,
        timeWindow: '11:30 - 13:00 (Trưa)',
      },
    },
    {
      id: 'ktx-b-overload',
      label: 'Kịch bản 3: Sinh viên về KTX Khu B buổi tối (+40 SV sạc qua đêm)',
      params: {
        hubId: 'H03',
        additionalUsers: 40,
        sharedVehicleUsageRate: 0.3,
        brokenChargerPercent: 0,
        timeWindow: '18:00 - 21:00 (Cao điểm tối)',
      },
    },
  ];

  const [activeParams, setActiveParams] = useState<WhatIfParameters>(presets[0].params);
  const [result, setResult] = useState<WhatIfResult | null>(() => runWhatIfSimulation(presets[0].params));

  const handleRun = () => {
    const res = runWhatIfSimulation(activeParams);
    setResult(res);
  };

  const handleApplyRec = (rec: WhatIfResult['recommendations'][0]) => {
    if (rec.sourceHubId && rec.targetHubId && rec.vehiclesToMove) {
      applyWhatIfRecommendation(rec.id, rec.sourceHubId, rec.targetHubId, rec.vehiclesToMove);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Mô Phỏng Tình Huống Giả Định</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              What-If AI Engine (TC-11 &amp; TC-12)
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Dự báo quá tải mạng lưới xe điện VinFast, tính toán xe thiếu hụt và tự động đề xuất phương án điều phối tối ưu
          </p>
        </div>

        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Play className="w-4 h-4" />
          <span>Chạy Mô Phỏng Lại</span>
        </button>
      </div>

      {/* Preset Scenario Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-600" />
          Chọn Kịch Bản Kiểm Thử Có Sẵn (Presets):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setActiveParams(preset.params);
                setResult(runWhatIfSimulation(preset.params));
              }}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                activeParams.hubId === preset.params.hubId &&
                activeParams.additionalUsers === preset.params.additionalUsers
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Simulation Parameters (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              Tham Số Kịch Bản (Input Parameters)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">ĐHQG-HCM</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Hub selection */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Trạm Hub Thử Nghiệm
              </label>
              <select
                value={activeParams.hubId}
                onChange={(e) => setActiveParams({ ...activeParams, hubId: e.target.value })}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {hubs.map((hub) => (
                  <option key={hub.hubId} value={hub.hubId}>
                    {hub.name} ({hub.hubId})
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Users */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Lượng sinh viên tăng đột biến</span>
                <span className="text-purple-600 font-bold">+{activeParams.additionalUsers} SV</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={activeParams.additionalUsers}
                onChange={(e) =>
                  setActiveParams({ ...activeParams, additionalUsers: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Vehicle Demand Rate */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Tỷ lệ có nhu cầu thuê xe VinFast</span>
                <span className="text-purple-600 font-bold">
                  {Math.round(activeParams.sharedVehicleUsageRate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={activeParams.sharedVehicleUsageRate}
                onChange={(e) =>
                  setActiveParams({
                    ...activeParams,
                    sharedVehicleUsageRate: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Broken Chargers Rate */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Tỷ lệ trụ sạc gặp sự cố mất điện</span>
                <span className="text-rose-600 font-bold">{activeParams.brokenChargerPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={activeParams.brokenChargerPercent}
                onChange={(e) =>
                  setActiveParams({
                    ...activeParams,
                    brokenChargerPercent: parseInt(e.target.value),
                  })
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Time Window */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Khung Giờ Mô Phỏng
              </label>
              <input
                type="text"
                value={activeParams.timeWindow}
                onChange={(e) => setActiveParams({ ...activeParams, timeWindow: e.target.value })}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleRun}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              <span>Chạy Phân Tích Kịch Bản</span>
            </button>
          </div>
        </div>

        {/* Right: Simulation Output & AI Recommendations (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Kết Quả Dự Báo &amp; Cảnh Báo Quá Tải
            </h3>
            {result && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  result.overloadLevel === 'Severe'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : result.overloadLevel === 'High'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                Mức độ: {result.overloadLevel}
              </span>
            )}
          </div>

          {result && (
            <div className="space-y-4">
              {/* Metric blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Tỷ lệ lấp đầy dự kiến</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {result.projectedOccupancyRate}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Số xe thiếu hụt (Deficit)</span>
                  <span className="text-xl font-black text-rose-600">
                    {result.vehiclesDeficit > 0 ? `-${result.vehiclesDeficit}` : '0'} xe
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Yêu cầu bị từ chối</span>
                  <span className="text-xl font-black text-amber-600">
                    {result.unservedRequests} lượt
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hàng đợi chờ sạc</span>
                  <span className="text-xl font-black text-purple-600">
                    {result.chargingQueueLength} xe
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block">Thời gian chờ sạc dự kiến</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ~{result.estimatedWaitTimeMinutes} phút
                  </span>
                </div>
              </div>

              {/* Recommendations Box (Section 7.18, TC-12) */}
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-xs text-purple-900 dark:text-purple-200">
                    Đề Xuất Hành Động Tự Động Hóa (Actionable Recommendations)
                  </h4>
                </div>

                <div className="space-y-2">
                  {result.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {rec.action}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                          {rec.description}
                        </span>
                      </div>

                      {rec.sourceHubId && rec.targetHubId && (
                        <button
                          onClick={() => handleApplyRec(rec)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Áp Dụng (TC-12)</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
