import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryBadge } from '../common/BatteryBadge';
import { 
  Bike, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  CalendarCheck
} from 'lucide-react';

export const VehicleListView: React.FC = () => {
  const { 
    vehicles, 
    hubs, 
    createVehicleReservation, 
    setSelectedVehicleId, 
    setActiveView 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minBattery, setMinBattery] = useState<number>(0);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vinfastSeries.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (selectedHub !== 'all' && v.hubId !== selectedHub) return false;
    if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
    if (v.batteryLevel < minBattery) return false;

    return true;
  });

  const handleBook = (vehicleId: string) => {
    const success = createVehicleReservation(vehicleId);
    if (success) {
      setActiveView('student-reservations');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Đội Xe Điện VinFast ĐHQG-HCM
          </h1>
          <p className="text-xs text-slate-500">
            Dòng xe điện chính hãng VinFast: E-Bike DrgnFly, E-Scooter Evo 200, Feliz S, Klara S, Mini e-SUV VF 3
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top: Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Tất cả phương tiện' },
            { id: 'electric-bike', label: 'E-Bike (VinFast DrgnFly)' },
            { id: 'electric-motorcycle', label: 'Xe máy điện (Evo 200, Feliz S, Klara)' },
            { id: 'electric-car', label: 'Ô tô điện (VinFast VF 3, VF 5)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bottom Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm xe, model, biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hub */}
          <div>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Tất cả Trạm Hub</option>
              {hubs.map((h) => (
                <option key={h.hubId} value={h.hubId}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Sẵn sàng (Available)</option>
              <option value="reserved">Đang giữ chỗ (Reserved)</option>
              <option value="in-use">Đang sử dụng (In-use)</option>
              <option value="waiting-for-charging">Chờ sạc pin (&lt;20%)</option>
              <option value="maintenance">Bảo trì (Maintenance)</option>
            </select>
          </div>

          {/* Min Battery */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Pin &gt;=</span>
            <input
              type="range"
              min="0"
              max="80"
              step="10"
              value={minBattery}
              onChange={(e) => setMinBattery(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-blue-600 w-8">{minBattery}%</span>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          Không tìm thấy xe nào thỏa mãn điều kiện lọc. Vui lòng thay đổi thông số.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredVehicles.map((vehicle) => {
            const hub = hubs.find((h) => h.hubId === vehicle.hubId);
            const isAvailable = vehicle.status === 'available';
            const hasEnoughBattery = vehicle.batteryLevel >= 20;
            const canBook = isAvailable && hasEnoughBattery;

            return (
              <div
                key={vehicle.vehicleId}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div 
                  className="relative h-40 bg-slate-800 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                >
                  {vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bike className="w-12 h-12 text-slate-500" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute top-2.5 right-2.5">
                    <BatteryBadge level={vehicle.batteryLevel} isCharging={vehicle.status === 'charging'} size="sm" />
                  </div>

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600/90 text-white">
                      {vehicle.vinfastSeries}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {vehicle.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">Biển số: {vehicle.licensePlate} • Màu: {vehicle.color}</p>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {hub?.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] py-2 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block">Tốc độ tối đa</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.maxSpeed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tầm hoạt động</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">~{vehicle.rangeKm} km</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Cước phí</span>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                        {vehicle.rentalPricePerHour.toLocaleString('vi-VN')} đ/h
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Xem thông số kỹ thuật"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canBook ? (
                        <button
                          onClick={() => handleBook(vehicle.vehicleId)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          Đặt Xe
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {vehicle.status === 'maintenance'
                            ? 'Bảo trì'
                            : !hasEnoughBattery
                            ? 'Chờ sạc (<20%)'
                            : vehicle.status === 'reserved'
                            ? 'Đã đặt'
                            : 'Đang thuê'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
