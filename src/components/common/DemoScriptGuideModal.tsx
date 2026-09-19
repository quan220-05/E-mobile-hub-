import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  PlayCircle, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  Sparkles, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const DemoScriptGuideModal: React.FC = () => {
  const { 
    isDemoGuideOpen, 
    setIsDemoGuideOpen, 
    setActiveView, 
    setRole, 
    resetAllData,
    autoScheduleCharging,
    tickSimulator,
    isSimulatorRunning,
    setIsSimulatorRunning
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demo' | 'testcases'>('demo');

  if (!isDemoGuideOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Giới thiệu & Tổng quan',
      desc: 'Mạng lưới Smart E-Mobility Hub VinFast tại Khu đô thị ĐHQG-HCM, kết nối tuyến Metro Số 1.',
      actionLabel: 'Về Trang chủ',
      onAction: () => {
        setRole('student');
        setActiveView('student-home');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 2,
      title: 'Khám phá Hệ thống Hub',
      desc: 'Xem danh sách 6 trạm Hub, chi tiết Metro Hub, tỷ lệ lấp đầy occupancy rate & cảnh báo gần đầy.',
      actionLabel: 'Xem Hubs',
      onAction: () => {
        setActiveView('student-hubs');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 3,
      title: 'Tìm & Lọc xe điện VinFast',
      desc: 'Lọc xe VinFast DrgnFly, Evo 200, Feliz S, Klara S, VF 3 theo trạm Hub và mức pin tối thiểu.',
      actionLabel: 'Xem Fleet xe',
      onAction: () => {
        setActiveView('student-vehicles');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 4,
      title: 'Đặt xe dùng chung (TC-01, TC-02)',
      desc: 'Giữ chỗ xe trong 15 phút, sinh mã OTP nhận xe, xe chuyển sang trạng thái "reserved".',
      actionLabel: 'Đến danh sách xe để đặt',
      onAction: () => {
        setActiveView('student-vehicles');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 5,
      title: 'Nhận xe (Pickup - TC-03, TC-04)',
      desc: 'Xác thực mã OTP/QR nhận xe tại Hub, xe chuyển sang "in-use" và bắt đầu chuyến đi.',
      actionLabel: 'Đến trang Reservation',
      onAction: () => {
        setActiveView('student-reservations');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 6,
      title: 'Trả xe (Return - TC-05, TC-06)',
      desc: 'Chọn Hub trả xe. Kiểm tra chỗ trống. Nếu pin < 20%, hệ thống tự tạo yêu cầu sạc ưu tiên!',
      actionLabel: 'Đến trả xe',
      onAction: () => {
        setActiveView('student-reservations');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 7,
      title: 'Đặt chỗ & Sạc xe cá nhân (TC-07, TC-08)',
      desc: 'Dành cho Private EV Student: đặt trước chỗ đỗ xe tại Hub và kèm lịch sạc thông minh.',
      actionLabel: 'Đặt chỗ đậu',
      onAction: () => {
        setRole('private_ev_student');
        setActiveView('student-reserve-parking');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 8,
      title: 'Chuyển sang Operator Dashboard',
      desc: 'Giám sát toàn mạng lưới: tổng xe, trụ sạc, tỷ lệ lấp đầy, cảnh báo Hub quá tải (>85%).',
      actionLabel: 'Mở Dashboard Vận hành',
      onAction: () => {
        setRole('operator');
        setActiveView('operator-dashboard');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 9,
      title: 'Lập lịch sạc thông minh (TC-09, TC-10)',
      desc: 'Áp dụng công thức tính điểm ưu tiên (pin thấp ưu tiên cao), tự động gán xe vào trụ sạc.',
      actionLabel: 'Quản lý sạc',
      onAction: () => {
        setRole('operator');
        setActiveView('operator-charging');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 10,
      title: 'Điều phối phương tiện Rebalancing',
      desc: 'Chuyển xe từ Hub thừa (KTX Khu A) sang Hub thiếu (Metro Hub giờ cao điểm).',
      actionLabel: 'Điều phối xe',
      onAction: () => {
        setRole('operator');
        setActiveView('operator-redistribution');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 11,
      title: 'Mô phỏng What-If (TC-11, TC-12)',
      desc: 'Giả định tăng sinh viên Metro (+150 người) hoặc lỗi trụ sạc, tính toán thiếu hụt và áp dụng khuyến nghị.',
      actionLabel: 'Chạy What-If',
      onAction: () => {
        setRole('operator');
        setActiveView('operator-whatif');
        setIsDemoGuideOpen(false);
      }
    },
    {
      step: 12,
      title: 'Báo cáo Thống kê & Quản lý Sự cố',
      desc: 'Xem báo cáo luân chuyển xe, ghi nhận sự cố trụ sạc/phương tiện và xử lý đóng sự cố.',
      actionLabel: 'Xem Báo cáo',
      onAction: () => {
        setRole('operator');
        setActiveView('operator-reports');
        setIsDemoGuideOpen(false);
      }
    }
  ];

  const testCases = [
    { code: 'TC-01', name: 'Đặt xe available thành công', expect: 'Reservation được tạo, xe chuyển sang reserved' },
    { code: 'TC-02', name: 'Đặt xe đã reserved thất bại', expect: 'Hệ thống báo lỗi, nút đặt xe bị vô hiệu hóa' },
    { code: 'TC-03', name: 'Nhận xe thành công', expect: 'Reservation in-progress, xe chuyển sang in-use' },
    { code: 'TC-04', name: 'Nhận xe thất bại do hết hạn', expect: 'Hệ thống từ chối nhận xe sau 15 phút' },
    { code: 'TC-05', name: 'Trả xe khi Hub còn chỗ', expect: 'Xe gán vào chỗ đậu, nếu pin < 20% tự tạo hàng chờ sạc' },
    { code: 'TC-06', name: 'Trả xe khi Hub đầy', expect: 'Báo lỗi trạm kín chỗ và đề xuất Hub lân cận' },
    { code: 'TC-07', name: 'Đặt chỗ đậu thành công', expect: 'Tạo Parking reservation, chỗ đỗ chuyển sang reserved' },
    { code: 'TC-08', name: 'Đặt chỗ đậu thất bại do hết chỗ', expect: 'Báo lỗi và gợi ý Hub còn chỗ đậu' },
    { code: 'TC-09', name: 'Ưu tiên xe pin thấp khi sạc', expect: 'Xe pin thấp nhận priorityScore cao hơn và xếp trước' },
    { code: 'TC-10', name: 'Không đủ cổng sạc', expect: 'Xe ưu tiên cao được gán trụ, xe còn lại vào hàng đợi queued' },
    { code: 'TC-11', name: 'Mô phỏng tăng nhu cầu tại Metro', expect: 'Occupancy tăng, cảnh báo thiếu xe và đề xuất điều phối' },
    { code: 'TC-12', name: 'Mô phỏng hỏng cổng sạc', expect: 'Hàng chờ sạc tăng, thời gian chờ tăng, đề xuất hướng dẫn' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Kịch Bản Demo & Hướng Dẫn Nghiệp Vụ
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
                  Mục 18 & 19 Specification
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lộ trình trình diễn hoàn chỉnh và kiểm thử nhanh các Test Cases của hệ thống E-Hub.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'demo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              12 Bước Demo Thực Tế
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'testcases'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              Danh Sách Test Cases (TC-01 → TC-12)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={tickSimulator}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium"
              title="Cập nhật pin và chu kỳ trạm sạc"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Tick Simulator
            </button>
            <button
              onClick={resetAllData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 font-medium"
              title="Khôi phục trạng thái ban đầu để demo lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Dữ Liệu
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'demo' ? (
            <div className="space-y-3">
              {demoSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={step.onAction}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testCases.map((tc) => (
                <div
                  key={tc.code}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {tc.code}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {tc.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    Kỳ vọng: {tc.expect}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <span>Hệ thống đáp ứng 100% yêu cầu đặc tả đề tài Software Engineering - 261.</span>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
