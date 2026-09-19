import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  Bike, 
  Search, 
  MapPin, 
  Wrench, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  SlidersHorizontal, 
  Zap 
} from 'lucide-react';

export const FleetManagementView: React.FC = () => {
  const { vehicles, hubs, updateVehicleStatus, relocateVehicle, setSelectedVehicleId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Relocate modal
  const [relocateModalVehicleId, setRelocateModalVehicleId] = useState<string | null>(null);
  const [targetHubId, setTargetHubId] = useState<string>('H01');

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedHub !== 'all' && v.hubId !== selectedHub) return false;
    if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
    return true;
  });

  const handleToggleMaintenance = (vehicleId: string, currentStatus: string) => {
    if (currentStatus === 'maintenance') {
      updateVehicleStatus(vehicleId, 'available');
    } else {
      updateVehicleStatus(vehicleId, 'maintenance');
    }
  };

  const handleConfirmRelocate = () => {
    if (!relocateModalVehicleId) return;
    relocateVehicle(relocateModalVehicleId, targetHubId);
    setRelocateModalVehicleId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Quản Lý Đội Xe Điện VinFast (Fleet Management)
          </h1>
          <p className="text-xs text-slate-500">
            Giám sát tình trạng pin, điều phối di chuyển giữa các trạm Hub và quản lý bảo trì đội xe ({vehicles.length} xe)
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm biển số, model, mã xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả Trạm Hub</option>
            {hubs.map((h) => (
              <option key={h.hubId} value={h.hubId}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Sẵn sàng (Available)</option>
            <option value="reserved">Đang giữ chỗ (Reserved)</option>
            <option value="in-use">Đang lưu hành (In-use)</option>
            <option value="charging">Đang sạc pin (Charging)</option>
            <option value="waiting-for-charging">Chờ sạc pin (&lt;20%)</option>
            <option value="maintenance">Bảo trì (Maintenance)</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Mã &amp; Phương Tiện</th>
                <th className="py-3 px-3">Biển Số / Màu</th>
                <th className="py-3 px-3">Trạm Hub</th>
                <th className="py-3 px-3">Mức Pin &amp; Trạng Thái</th>
                <th className="py-3 px-3">Tình Trạng Vận Hành</th>
                <th className="py-3 px-3 text-right">Hành Động Điều Phối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVehicles.map((vehicle) => {
                const hub = hubs.find((h) => h.hubId === vehicle.hubId);
                const isMaint = vehicle.status === 'maintenance';

                return (
                  <tr key={vehicle.vehicleId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                          {vehicle.imageUrl ? (
                            <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
                          ) : (
                            <Bike className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold uppercase">
                              {vehicle.vinfastSeries}
                            </span>
                            <span>{vehicle.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{vehicle.vehicleId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{vehicle.licensePlate}</div>
                      <div className="text-[10px] text-slate-400">Màu: {vehicle.color}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        {hub?.name || vehicle.hubId}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <BatteryBadge
                        level={vehicle.batteryLevel}
                        isCharging={vehicle.status === 'charging'}
                        size="sm"
                      />
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          vehicle.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : vehicle.status === 'in-use'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : vehicle.status === 'maintenance'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : vehicle.status === 'waiting-for-charging'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {vehicle.status === 'available'
                          ? 'Sẵn sàng'
                          : vehicle.status === 'in-use'
                          ? 'Đang lưu hành'
                          : vehicle.status === 'maintenance'
                          ? 'Đang bảo trì'
                          : vehicle.status === 'waiting-for-charging'
                          ? 'Chờ sạc (<20%)'
                          : vehicle.status === 'charging'
                          ? 'Đang sạc'
                          : 'Đã đặt'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle maintenance */}
                        <button
                          onClick={() => handleToggleMaintenance(vehicle.vehicleId, vehicle.status)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isMaint
                              ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={isMaint ? 'Hoàn tất bảo trì -> Sẵn sàng' : 'Chuyển sang bảo trì'}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>

                        {/* Relocate button */}
                        <button
                          onClick={() => {
                            setRelocateModalVehicleId(vehicle.vehicleId);
                            setTargetHubId(vehicle.hubId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-[11px] hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Điều chuyển</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relocate Vehicle Modal */}
      {relocateModalVehicleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Điều Chuyển Phương Tiện Sang Hub Khác
              </h3>
              <p className="text-xs text-slate-500">
                Phương tiện: {vehicles.find((v) => v.vehicleId === relocateModalVehicleId)?.name}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Chọn Trạm Hub Đích
              </label>
              <select
                value={targetHubId}
                onChange={(e) => setTargetHubId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {hubs.map((h) => (
                  <option key={h.hubId} value={h.hubId}>
                    {h.name} ({h.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRelocateModalVehicleId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRelocate}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition-colors"
              >
                Xác Nhận Điều Chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
