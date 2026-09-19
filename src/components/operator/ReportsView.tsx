import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Leaf, 
  Download, 
  Calendar, 
  FileText, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { hubs, vehicles, reservations, chargingRequests, addToast } = useApp();

  const [dateRange, setDateRange] = useState('7d');

  // Computed metrics
  const completedTrips = reservations.filter((r) => r.status === 'completed').length + 18;
  const totalKwh = 428.5; // kWh charged
  const co2SavedKg = Math.round(completedTrips * 1.8 + totalKwh * 0.45); // kg CO2 saved
  const estimatedRevenue = completedTrips * 25000 + 450000;

  const handleExport = () => {
    addToast({
      title: 'Xuất Báo Cáo Thành Công',
      message: 'Đã xuất file báo cáo tổng hợp: VinFast_Hub_Report_Q3_VNU.csv',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Báo Cáo &amp; Phân Tích Vận Hành (Reports &amp; Analytics)
          </h1>
          <p className="text-xs text-slate-500">
            Hiệu suất mạng lưới xe điện VinFast, chỉ số giảm phát thải xanh và doanh thu khai thác tại ĐHQG-HCM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="24h">24 Giờ qua</option>
            <option value="7d">7 Ngày gần nhất</option>
            <option value="30d">Tháng này (30 Ngày)</option>
            <option value="quarter">Học kỳ 1 (Quý 3/2026)</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tổng Chuyến Đi Xanh</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{completedTrips} lượt</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +24.8% so với tuần trước</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Sản Lượng Sạc Điện</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalKwh} kWh</div>
          <p className="text-[11px] text-slate-500 mt-1">Công suất sạc bình quân: 5.8 kW</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">CO2 Giảm Thiểu</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{co2SavedKg} kg CO2</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Tương đương trồng 12 cây xanh</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Doanh Thu Ước Tính</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {estimatedRevenue.toLocaleString('vi-VN')} đ
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Hỗ trợ trợ giá sinh viên ĐHQG</p>
        </div>
      </div>

      {/* Hub Performance Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Thống Kê Khai Thác Theo Từng Trạm Hub
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Mã Trạm</th>
                <th className="py-3 px-3">Tên Trạm Hub</th>
                <th className="py-3 px-3">Lượt Thuê Xe</th>
                <th className="py-3 px-3">Lượt Đậu &amp; Sạc</th>
                <th className="py-3 px-3">Điện Năng (kWh)</th>
                <th className="py-3 px-3">Hiệu Suất Khai Thác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hubs.map((hub, idx) => {
                const rentals = Math.round(15 + idx * 8);
                const chargingSessions = Math.round(8 + idx * 4);
                const kwh = Math.round(rentals * 4.5 + chargingSessions * 12);
                const efficiency = Math.min(98, Math.round(72 + idx * 5));

                return (
                  <tr key={hub.hubId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-slate-500">{hub.hubId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{hub.name}</td>
                    <td className="py-3 px-3">{rentals} lượt</td>
                    <td className="py-3 px-3">{chargingSessions} lượt</td>
                    <td className="py-3 px-3 font-mono">{kwh} kWh</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${efficiency}%` }} />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{efficiency}%</span>
                      </div>
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
