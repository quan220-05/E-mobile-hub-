import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  Zap, 
  Bike, 
  ArrowUpDown,
  Eye
} from 'lucide-react';

export const HubListView: React.FC = () => {
  const { hubs, getHubStats, setSelectedHubId, userRole } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'near-capacity' | 'full'>('all');
  const [sortBy, setSortBy] = useState<'occupancy' | 'name' | 'availableVehicles' | 'availableParking'>('occupancy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter & Sort
  const processedHubs = hubs
    .filter((hub) => {
      const matchSearch =
        hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hub.hubId.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      const stats = getHubStats(hub.hubId);
      if (statusFilter === 'near-capacity') return stats.isNearCapacity && !stats.isFull;
      if (statusFilter === 'full') return stats.isFull;
      if (statusFilter === 'normal') return !stats.isNearCapacity;

      return true;
    })
    .sort((a, b) => {
      const statsA = getHubStats(a.hubId);
      const statsB = getHubStats(b.hubId);

      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortBy === 'occupancy') {
        valA = statsA.occupancyRate;
        valB = statsB.occupancyRate;
      } else if (sortBy === 'availableVehicles') {
        valA = statsA.availableVehicles;
        valB = statsB.availableVehicles;
      } else if (sortBy === 'availableParking') {
        valA = statsA.availableParking;
        valB = statsB.availableParking;
      } else {
        valA = a.name;
        valB = b.name;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Mạng Lưới Mobility Hubs ĐHQG-HCM
          </h1>
          <p className="text-xs text-slate-500">
            Hệ thống 6 trạm tập kết, bãi đỗ thông minh và trạm sạc xe điện VinFast
          </p>
        </div>
      </div>

      {/* Filter Toolbar (Section 7.3) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên Hub hoặc địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="normal">Bình thường (&lt;85%)</option>
            <option value="near-capacity">Cảnh báo gần đầy (&gt;85%)</option>
            <option value="full">Đã hết chỗ (Full)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="occupancy">Sắp xếp: Tỷ lệ lấp đầy</option>
            <option value="availableVehicles">Sắp xếp: Số xe sẵn có</option>
            <option value="availableParking">Sắp xếp: Chỗ đỗ còn trống</option>
            <option value="name">Sắp xếp: Tên trạm</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="Đảo chiều sắp xếp"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {processedHubs.map((hub) => {
          const stats = getHubStats(hub.hubId);
          return (
            <div
              key={hub.hubId}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all group"
            >
              {/* Hub Image & Top Badge */}
              <div className="relative h-40 bg-slate-800 overflow-hidden">
                {hub.image ? (
                  <img
                    src={hub.image}
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                    <MapPin className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur text-white">
                    {hub.hubId}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {stats.isFull ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Hết Chỗ
                    </span>
                  ) : stats.isNearCapacity ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Gần Đầy (&gt;85%)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Tối Ưu
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                    {hub.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                    {hub.location}
                  </p>
                </div>
              </div>

              {/* Hub Metrics & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Mức độ sử dụng chỗ:</span>
                    <span
                      className={`font-black ${
                        stats.isNearCapacity ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {stats.occupancyRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stats.isFull
                          ? 'bg-rose-500'
                          : stats.isNearCapacity
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${stats.occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Xe sẵn có</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                      {stats.availableVehicles}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Chỗ trống</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {stats.availableParking}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Trụ sạc rảnh</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {stats.availableChargers}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHubId(hub.hubId)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem Chi Tiết Hub & Đặt Chỗ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
