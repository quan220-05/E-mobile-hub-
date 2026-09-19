import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentType, IncidentSeverity } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Plus, 
  MapPin, 
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';

export const IncidentManagementView: React.FC = () => {
  const { incidents, hubs, currentUser, createIncident, updateIncidentStatus } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hubId, setHubId] = useState('H01');
  const [type, setType] = useState<IncidentType>('vehicle-failure');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [entityType, setEntityType] = useState<'vehicle' | 'charging-point' | 'parking-space' | 'hub'>('vehicle');
  const [entityId, setEntityId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    const hub = hubs.find((h) => h.hubId === hubId);
    createIncident({
      hubId,
      hubName: hub?.name || 'VinFast Hub',
      type,
      severity,
      entityType,
      entityId: entityId || `${hubId}-SYSTEM`,
      description,
      status: 'open',
      reporter: currentUser.name || 'Điều Phối Viên VinFast',
    });
    setShowCreateModal(false);
    setDescription('');
    setEntityId('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Quản Lý Sự Cố Kỹ Thuật (Incident Management)
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi, phân công và xử lý sự cố thiết bị tại trạm Hub: xe điện, trụ sạc, cảm biến đỗ xe
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Báo Sự Cố Mới</span>
        </button>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="font-bold text-sm">Hệ thống đang hoạt động hoàn hảo!</p>
            <p className="text-xs">Không có sự cố kỹ thuật nào chưa được xử lý.</p>
          </div>
        ) : (
          incidents.map((incident) => {
            const hub = hubs.find((h) => h.hubId === incident.hubId);
            const isOpen = incident.status === 'open';
            const isInProgress = incident.status === 'in-progress';
            const isResolved = incident.status === 'resolved' || incident.status === 'closed';

            return (
              <div
                key={incident.incidentId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      incident.severity === 'critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                        : incident.severity === 'high'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {incident.incidentId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          incident.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                            : incident.severity === 'high'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {incident.severity}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        • {incident.type}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
                      {incident.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {hub?.name || incident.hubName}
                      </span>
                      {incident.entityId && (
                        <span>Thiết bị: <strong>{incident.entityId}</strong></span>
                      )}
                      <span>Người báo: {incident.reporter}</span>
                      <span>Thời điểm: {new Date(incident.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {isOpen && (
                    <button
                      onClick={() => updateIncidentStatus(incident.incidentId, 'in-progress')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                    >
                      Tiếp Nhận Xử Lý
                    </button>
                  )}
                  {isInProgress && (
                    <button
                      onClick={() => updateIncidentStatus(incident.incidentId, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Hoàn Tất Sửa Chữa</span>
                    </button>
                  )}
                  {isResolved && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã khắc phục
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Báo Cáo Sự Cố Kỹ Thuật Mới
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Trạm Hub Xảy Ra Sự Cố
                </label>
                <select
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {hubs.map((h) => (
                    <option key={h.hubId} value={h.hubId}>
                      {h.name} ({h.hubId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Loại sự cố
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as IncidentType)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="vehicle-failure">Hư hỏng xe điện</option>
                    <option value="charging-point-failure">Lỗi trụ sạc điện</option>
                    <option value="parking-full">Quá tải bãi đỗ</option>
                    <option value="reservation-conflict">Xung đột đặt chỗ</option>
                    <option value="system-alert">Cảnh báo hệ thống</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mức độ nghiêm trọng
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="critical">Khẩn cấp (Critical)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Thực thể ảnh hưởng
                  </label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as any)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="vehicle">Xe điện</option>
                    <option value="charging-point">Trụ sạc</option>
                    <option value="parking-space">Chỗ đỗ xe</option>
                    <option value="hub">Toàn bộ trạm Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mã thiết bị / Biển số
                  </label>
                  <input
                    type="text"
                    placeholder="VD: VF-EVO-01 hoặc CP-001"
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mô tả chi tiết sự cố
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả hiện tượng và ghi chú xử lý..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-md transition-colors"
                >
                  Lưu Sự Cố
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
