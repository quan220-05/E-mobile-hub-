import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  UserRole,
  Hub,
  Vehicle,
  VehicleStatus,
  ParkingSpace,
  ChargingPoint,
  Reservation,
  ChargingRequest,
  Incident,
  AppSettings,
  ToastMessage,
  WhatIfParameters,
  WhatIfResult,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HUBS,
  INITIAL_VEHICLES,
  INITIAL_PARKING_SPACES,
  INITIAL_CHARGING_POINTS,
  INITIAL_RESERVATIONS,
  INITIAL_CHARGING_REQUESTS,
  INITIAL_INCIDENTS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  userRole: UserRole;
  setRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  hubs: Hub[];
  vehicles: Vehicle[];
  parkingSpaces: ParkingSpace[];
  chargingPoints: ChargingPoint[];
  reservations: Reservation[];
  chargingRequests: ChargingRequest[];
  incidents: Incident[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  
  // Modals & Navigation Helpers
  selectedHubId: string | null;
  setSelectedHubId: (id: string | null) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;

  // Computed Hub Stats
  getHubStats: (hubId: string) => {
    availableParking: number;
    occupiedParking: number;
    availableChargers: number;
    availableVehicles: number;
    totalVehicles: number;
    occupancyRate: number;
    isNearCapacity: boolean;
    isFull: boolean;
  };

  // Authentication
  isAuthenticated: boolean;
  login: (credentials: { identifier: string; password?: string; rolePreference?: UserRole }) => { success: boolean; error?: string };
  logout: () => void;

  // Student Actions
  createVehicleReservation: (vehicleId: string) => boolean;
  pickupVehicle: (reservationId: string) => boolean;
  returnVehicle: (reservationId: string, targetHubId: string) => { success: boolean; message: string; alternativeHub?: Hub };
  cancelReservation: (reservationId: string) => void;
  createParkingReservation: (hubId: string, startTime: string, durationMinutes: number, withCharging: boolean) => boolean;
  createChargingRequest: (hubId: string, vehicleId: string, vehiclePlate: string, vehicleModel: string, batteryLevel: number, targetBattery: number, timeSlot: string) => boolean;
  cancelChargingRequest: (requestId: string) => void;

  // Operator Actions
  autoScheduleCharging: () => { scheduledCount: number; queuedCount: number };
  manualAssignCharger: (requestId: string, pointId: string) => boolean;
  toggleVehicleMaintenance: (vehicleId: string) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  redistributeVehicle: (vehicleId: string, targetHubId: string) => boolean;
  relocateVehicle: (vehicleId: string, targetHubId: string) => boolean;
  toggleChargingPointStatus: (pointId: string) => void;
  createIncident: (incident: Omit<Incident, 'incidentId' | 'createdAt'>) => void;
  updateIncidentStatus: (incidentId: string, status: Incident['status']) => void;
  runWhatIfSimulation: (params: WhatIfParameters) => WhatIfResult;
  applyWhatIfRecommendation: (recId: string, sourceHubId: string, targetHubId: string, count: number) => void;

  // Simulator
  isSimulatorRunning: boolean;
  setIsSimulatorRunning: (running: boolean) => void;
  tickSimulator: () => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'VINFAST_SMART_EMOBILITY_DATA_V1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_USER');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [activeView, setActiveView] = useState<string>('student-home');
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);

  const [hubs, setHubs] = useState<Hub[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_HUBS');
    return saved ? JSON.parse(saved) : INITIAL_HUBS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_VEHICLES');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_PARKING');
    return saved ? JSON.parse(saved) : INITIAL_PARKING_SPACES;
  });

  const [chargingPoints, setChargingPoints] = useState<ChargingPoint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_CHARGERS');
    return saved ? JSON.parse(saved) : INITIAL_CHARGING_POINTS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_RESERVATIONS');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [chargingRequests, setChargingRequests] = useState<ChargingRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_CHARGING_REQUESTS');
    return saved ? JSON.parse(saved) : INITIAL_CHARGING_REQUESTS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_INCIDENTS');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_SETTINGS');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      viewMode: 'detailed',
      fontSize: 'medium',
      alertsEnabled: true,
      autoSimulator: false,
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_AUTH');
    return saved === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_AUTH', isAuthenticated ? 'true' : 'false');
    localStorage.setItem(STORAGE_KEY + '_USER', JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEY + '_HUBS', JSON.stringify(hubs));
    localStorage.setItem(STORAGE_KEY + '_VEHICLES', JSON.stringify(vehicles));
    localStorage.setItem(STORAGE_KEY + '_PARKING', JSON.stringify(parkingSpaces));
    localStorage.setItem(STORAGE_KEY + '_CHARGERS', JSON.stringify(chargingPoints));
    localStorage.setItem(STORAGE_KEY + '_RESERVATIONS', JSON.stringify(reservations));
    localStorage.setItem(STORAGE_KEY + '_CHARGING_REQUESTS', JSON.stringify(chargingRequests));
    localStorage.setItem(STORAGE_KEY + '_INCIDENTS', JSON.stringify(incidents));
    localStorage.setItem(STORAGE_KEY + '_SETTINGS', JSON.stringify(settings));
  }, [isAuthenticated, currentUser, hubs, vehicles, parkingSpaces, chargingPoints, reservations, chargingRequests, incidents, settings]);

  // Toast Helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, timestamp: Date.now() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme) {
        if (newSettings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return updated;
    });
  }, []);

  // Sync theme with DOM initially
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Authentication Login
  const login = useCallback(
    (credentials: { identifier: string; password?: string; rolePreference?: UserRole }): { success: boolean; error?: string } => {
      const idRaw = (credentials.identifier || '').trim();
      const pwdRaw = (credentials.password || '').trim();
      const lowerId = idRaw.toLowerCase();

      if (!lowerId) {
        return {
          success: false,
          error: 'Vui lòng nhập tên đăng nhập hoặc email trường @hcmut.edu.vn.',
        };
      }

      // Case 1: Admin account
      // "tài khoảng admin thì tạm thời để username và pass là admin"
      if (lowerId === 'admin' || lowerId === 'admin@hcmut.edu.vn') {
        if (pwdRaw !== 'admin') {
          return {
            success: false,
            error: 'Mật khẩu tài khoản admin không chính xác. Mật khẩu tạm thời là "admin".',
          };
        }

        const adminUser: User = {
          userId: 'U_ADMIN',
          name: 'Quản Trị Viên (Admin Bách Khoa)',
          role: 'operator',
          email: 'admin@hcmut.edu.vn',
          phone: '0988776655',
        };

        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        setActiveView('operator-dashboard');
        localStorage.setItem(STORAGE_KEY + '_AUTH', 'true');
        localStorage.setItem(STORAGE_KEY + '_USER', JSON.stringify(adminUser));

        addToast({
          title: 'Đăng nhập Quản Trị Viên thành công',
          message: 'Chào mừng bạn đến với Trung tâm Điều phối & Quản trị VinFast Hub!',
          type: 'success',
        });
        return { success: true };
      }

      // Case 2: Only emails ending with @hcmut.edu.vn are allowed
      // "chỉ cho các email với đuôi hcmut.edu.vn được đăng nhập"
      if (!lowerId.endsWith('@hcmut.edu.vn')) {
        return {
          success: false,
          error: 'Chỉ các email có đuôi @hcmut.edu.vn (Sinh viên / Giảng viên Trường ĐH Bách Khoa - ĐHQG-HCM) mới được phép đăng nhập.',
        };
      }

      const usernamePart = lowerId.replace('@hcmut.edu.vn', '').trim();
      if (!usernamePart) {
        return {
          success: false,
          error: 'Vui lòng nhập đúng địa chỉ email, ví dụ: an.nguyen@hcmut.edu.vn.',
        };
      }

      // Find existing user or generate student profile
      const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === lowerId);
      const rolePref = credentials.rolePreference || existing?.role || 'student';

      const studentIdMatch = usernamePart.match(/\d{7,8}/);
      const defaultStudentId = studentIdMatch ? studentIdMatch[0] : (existing?.studentId || '22110088');

      const formattedName = existing?.name || usernamePart
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const studentUser: User = existing
        ? {
            ...existing,
            role: rolePref,
          }
        : {
            userId: 'U_' + Date.now().toString(36),
            name: formattedName || 'Sinh Viên Bách Khoa',
            role: rolePref,
            email: lowerId,
            studentId: defaultStudentId,
            phone: '090' + Math.floor(1000000 + Math.random() * 9000000),
            vehiclePlate: rolePref === 'private_ev_student' ? '59-B1 988.22' : undefined,
            vehicleModel: rolePref === 'private_ev_student' ? 'VinFast Feliz S (Xám)' : undefined,
          };

      setCurrentUser(studentUser);
      setIsAuthenticated(true);
      if (rolePref === 'operator') {
        setActiveView('operator-dashboard');
      } else if (rolePref === 'private_ev_student') {
        setActiveView('student-reserve-parking');
      } else {
        setActiveView('student-home');
      }

      localStorage.setItem(STORAGE_KEY + '_AUTH', 'true');
      localStorage.setItem(STORAGE_KEY + '_USER', JSON.stringify(studentUser));

      addToast({
        title: 'Đăng nhập thành công',
        message: `Xin chào ${studentUser.name} (${studentUser.email})!`,
        type: 'success',
      });
      return { success: true };
    },
    [addToast]
  );

  // Authentication Logout
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEY + '_AUTH', 'false');
    setActiveView('student-home');
    addToast({
      title: 'Đã đăng xuất',
      message: 'Bạn đã đăng xuất khỏi hệ thống VinFast Smart Hub.',
      type: 'info',
    });
  }, [addToast]);

  // Switch Role
  const setRole = useCallback((role: UserRole) => {
    const matchingUser = INITIAL_USERS.find((u) => u.role === role) || {
      userId: 'U_CUSTOM',
      name: role === 'operator' ? 'Kỹ sư Vận hành' : 'Sinh viên Bách Khoa',
      role,
      email: `${role}@hcmut.edu.vn`,
    };
    setCurrentUser(matchingUser);
    if (role === 'operator') {
      setActiveView('operator-dashboard');
    } else if (role === 'private_ev_student') {
      setActiveView('student-reserve-parking');
    } else {
      setActiveView('student-home');
    }
    addToast({
      title: 'Đã chuyển vai trò',
      message: `Đang đăng nhập dưới quyền: ${role === 'operator' ? 'Đơn vị Vận hành (Operator)' : role === 'private_ev_student' ? 'Sinh viên có xe điện cá nhân' : 'Sinh viên sử dụng xe dùng chung'}`,
      type: 'info',
    });
  }, [addToast]);

  // Compute Hub Stats
  const getHubStats = useCallback((hubId: string) => {
    const hub = hubs.find((h) => h.hubId === hubId);
    const totalSpaces = hub?.totalParkingSpaces || 40;
    
    const spaces = parkingSpaces.filter((p) => p.hubId === hubId);
    const availableParking = spaces.filter((p) => p.status === 'empty').length;
    const occupiedParking = totalSpaces - availableParking;
    
    const chargers = chargingPoints.filter((c) => c.hubId === hubId);
    const availableChargers = chargers.filter((c) => c.status === 'available').length;
    
    const hubVehicles = vehicles.filter((v) => v.hubId === hubId);
    const availableVehicles = hubVehicles.filter((v) => v.status === 'available').length;
    const totalVehicles = hubVehicles.length;
    
    const occupancyRate = Math.min(100, Math.round((occupiedParking / totalSpaces) * 100));
    const isNearCapacity = occupancyRate >= 85 || availableParking <= 2;
    const isFull = availableParking <= 0;

    return {
      availableParking,
      occupiedParking,
      availableChargers,
      availableVehicles,
      totalVehicles,
      occupancyRate,
      isNearCapacity,
      isFull,
    };
  }, [hubs, parkingSpaces, chargingPoints, vehicles]);

  // Check Expirations every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      setReservations((prev) =>
        prev.map((res) => {
          if (res.status === 'confirmed' && res.expiresAt < now) {
            // Revert vehicle back to available
            if (res.type === 'vehicle' && res.vehicleId) {
              setVehicles((vList) =>
                vList.map((v) =>
                  v.vehicleId === res.vehicleId && v.status === 'reserved'
                    ? { ...v, status: 'available' }
                    : v
                )
              );
            }
            // Revert parking space
            if (res.type === 'parking' && res.spaceId) {
              setParkingSpaces((pList) =>
                pList.map((p) =>
                  p.spaceId === res.spaceId && p.status === 'reserved'
                    ? { ...p, status: 'empty', reservedBy: null }
                    : p
                )
              );
            }
            addToast({
              title: 'Đặt chỗ đã hết hạn',
              message: `Mã ${res.reservationId} đã hết thời gian giữ chỗ 15 phút. Phương tiện đã được hoàn trả về trạng thái sẵn sàng.`,
              type: 'warning',
            });
            return { ...res, status: 'expired' };
          }
          return res;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [addToast]);

  // 1. Create Vehicle Reservation
  const createVehicleReservation = useCallback((vehicleId: string): boolean => {
    const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
    if (!vehicle) {
      addToast({ title: 'Lỗi', message: 'Không tìm thấy xe', type: 'error' });
      return false;
    }
    if (vehicle.status !== 'available') {
      addToast({
        title: 'Không thể đặt xe (TC-02)',
        message: `Xe ${vehicle.name} hiện không ở trạng thái sẵn sàng (Trạng thái: ${vehicle.status}).`,
        type: 'error',
      });
      return false;
    }
    if (vehicle.batteryLevel < 20) {
      addToast({
        title: 'Mức pin không đủ',
        message: `Xe ${vehicle.name} chỉ còn ${vehicle.batteryLevel}% pin (Yêu cầu tối thiểu 20% để nhận cuốc).`,
        type: 'warning',
      });
      return false;
    }

    // Check if user already has an active vehicle reservation
    const hasActive = reservations.some(
      (r) => r.userId === currentUser.userId && r.type === 'vehicle' && (r.status === 'confirmed' || r.status === 'in-progress')
    );
    if (hasActive) {
      addToast({
        title: 'Đã có lượt đặt xe đang hoạt động',
        message: 'Mỗi sinh viên chỉ được đặt 01 phương tiện dùng chung tại một thời điểm.',
        type: 'warning',
      });
      return false;
    }

    const hub = hubs.find((h) => h.hubId === vehicle.hubId);
    const newResId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const otp = 'VF-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const expires = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins

    const newReservation: Reservation = {
      reservationId: newResId,
      userId: currentUser.userId,
      userName: currentUser.name,
      type: 'vehicle',
      vehicleId: vehicle.vehicleId,
      hubId: vehicle.hubId,
      hubName: hub?.name || 'VinFast Hub',
      status: 'confirmed',
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      durationMinutes: 15,
      pickupOtp: otp,
      cost: vehicle.rentalPricePerHour,
    };

    // Update vehicle status
    setVehicles((prev) =>
      prev.map((v) => (v.vehicleId === vehicleId ? { ...v, status: 'reserved' } : v))
    );
    setReservations((prev) => [newReservation, ...prev]);

    addToast({
      title: 'Đặt xe thành công! (TC-01)',
      message: `Đã giữ xe ${vehicle.name} tại ${hub?.name}. Mã nhận xe OTP: ${otp}. Hạn nhận xe: 15 phút.`,
      type: 'success',
    });
    return true;
  }, [vehicles, reservations, currentUser, hubs, addToast]);

  // 2. Pickup Vehicle
  const pickupVehicle = useCallback((reservationId: string): boolean => {
    const res = reservations.find((r) => r.reservationId === reservationId);
    if (!res) return false;

    if (res.status === 'expired') {
      addToast({
        title: 'Nhận xe thất bại (TC-04)',
        message: 'Lượt giữ chỗ đã hết hạn 15 phút. Phương tiện đã được giải phóng.',
        type: 'error',
      });
      return false;
    }

    if (res.status !== 'confirmed') {
      addToast({
        title: 'Thao tác không hợp lệ',
        message: 'Lượt đặt chỗ không ở trạng thái sẵn sàng để nhận xe.',
        type: 'warning',
      });
      return false;
    }

    // Mark vehicle in-use and reservation in-progress
    setReservations((prev) =>
      prev.map((r) => (r.reservationId === reservationId ? { ...r, status: 'in-progress' } : r))
    );
    if (res.vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.vehicleId === res.vehicleId ? { ...v, status: 'in-use', currentUserId: res.userId } : v))
      );
      // Free the parking slot at current hub
      setParkingSpaces((prev) =>
        prev.map((p) =>
          p.currentVehicleId === res.vehicleId ? { ...p, status: 'empty', currentVehicleId: null } : p
        )
      );
    }

    addToast({
      title: 'Nhận xe thành công! (TC-03)',
      message: 'Hệ thống đã mở khóa phương tiện. Chúc bạn có chuyến đi an toàn và thân thiện môi trường!',
      type: 'success',
    });
    return true;
  }, [reservations, addToast]);

  // 3. Return Vehicle
  const returnVehicle = useCallback(
    (reservationId: string, targetHubId: string): { success: boolean; message: string; alternativeHub?: Hub } => {
      const res = reservations.find((r) => r.reservationId === reservationId);
      if (!res || !res.vehicleId) {
        return { success: false, message: 'Không tìm thấy thông tin chuyến xe' };
      }

      const targetHub = hubs.find((h) => h.hubId === targetHubId);
      const targetStats = getHubStats(targetHubId);

      // TC-06: Check if Hub is full!
      if (targetStats.availableParking <= 0) {
        // Find alternative hub with available spaces
        const alternative = hubs.find((h) => h.hubId !== targetHubId && getHubStats(h.hubId).availableParking > 0);
        return {
          success: false,
          message: `Hub ${targetHub?.name} hiện đã kín chỗ đậu. Vui lòng chuyển hướng sang trạm lân cận.`,
          alternativeHub: alternative,
        };
      }

      // Find an empty parking space at target hub to park
      const emptySlot = parkingSpaces.find((p) => p.hubId === targetHubId && p.status === 'empty');
      const vehicle = vehicles.find((v) => v.vehicleId === res.vehicleId);

      // Simulate battery decrease during trip
      const drainedBattery = Math.max(12, (vehicle?.batteryLevel || 80) - Math.floor(15 + Math.random() * 20));

      let nextVehicleStatus: Vehicle['status'] = 'available';
      let autoChargingCreated = false;

      // Business Rule: If battery < 20%, auto queue for charging
      if (drainedBattery < 20) {
        nextVehicleStatus = 'waiting-for-charging';
        autoChargingCreated = true;

        const newChargeReq: ChargingRequest = {
          requestId: 'CHG-AUTO-' + Math.floor(1000 + Math.random() * 9000),
          userId: res.userId,
          userName: res.userName,
          vehicleId: res.vehicleId,
          vehicleModel: vehicle?.modelName || 'VinFast EV',
          vehiclePlate: vehicle?.licensePlate || '59-VF',
          hubId: targetHubId,
          hubName: targetHub?.name || 'Hub',
          batteryLevel: drainedBattery,
          targetBattery: 90,
          requestedTime: new Date().toISOString(),
          timeSlot: 'Ngay khi có trụ sạc',
          urgencyFactor: 90,
          hubPressureFactor: 80,
          priorityScore: Math.round(((100 - drainedBattery) * 0.6 + 90 * 0.3 + 80 * 0.1) * 10) / 10,
          status: 'queued',
        };
        setChargingRequests((prev) => [newChargeReq, ...prev]);
      }

      // Update vehicle
      setVehicles((prev) =>
        prev.map((v) =>
          v.vehicleId === res.vehicleId
            ? {
                ...v,
                hubId: targetHubId,
                batteryLevel: drainedBattery,
                status: nextVehicleStatus,
                currentUserId: null,
              }
            : v
        )
      );

      // Occupy slot at target hub
      if (emptySlot) {
        setParkingSpaces((prev) =>
          prev.map((p) =>
            p.spaceId === emptySlot.spaceId
              ? { ...p, status: 'occupied', currentVehicleId: res.vehicleId || null }
              : p
          )
        );
      }

      // Complete reservation
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId
            ? { ...r, status: 'completed', endTime: new Date().toLocaleTimeString('vi-VN') }
            : r
        )
      );

      const msg = autoChargingCreated
        ? `Trả xe thành công tại ${targetHub?.name} (TC-05). Pin xe còn ${drainedBattery}% (<20%), hệ thống đã tự động kích hoạt yêu cầu sạc ưu tiên!`
        : `Trả xe thành công tại ${targetHub?.name} (TC-05). Pin xe còn ${drainedBattery}%. Cảm ơn bạn đã sử dụng VinFast Smart Mobility!`;

      addToast({
        title: 'Hoàn tất chuyến đi',
        message: msg,
        type: 'success',
      });

      return { success: true, message: msg };
    },
    [reservations, hubs, getHubStats, parkingSpaces, vehicles, addToast]
  );

  // 4. Cancel Reservation
  const cancelReservation = useCallback(
    (reservationId: string) => {
      const res = reservations.find((r) => r.reservationId === reservationId);
      if (!res) return;

      if (res.type === 'vehicle' && res.vehicleId) {
        setVehicles((prev) =>
          prev.map((v) => (v.vehicleId === res.vehicleId ? { ...v, status: 'available' } : v))
        );
      } else if (res.type === 'parking' && res.spaceId) {
        setParkingSpaces((prev) =>
          prev.map((p) => (p.spaceId === res.spaceId ? { ...p, status: 'empty', reservedBy: null } : p))
        );
      }

      setReservations((prev) =>
        prev.map((r) => (r.reservationId === reservationId ? { ...r, status: 'cancelled' } : r))
      );

      addToast({
        title: 'Đã hủy đặt chỗ',
        message: `Lượt đặt chỗ ${reservationId} đã được hủy và giải phóng tài nguyên.`,
        type: 'info',
      });
    },
    [reservations, addToast]
  );

  // 5. Create Parking Reservation (Private EV Student)
  const createParkingReservation = useCallback(
    (hubId: string, startTime: string, durationMinutes: number, withCharging: boolean): boolean => {
      const stats = getHubStats(hubId);
      const hub = hubs.find((h) => h.hubId === hubId);

      // TC-08: Check if full
      if (stats.availableParking <= 0) {
        const alternative = hubs.find((h) => h.hubId !== hubId && getHubStats(h.hubId).availableParking > 0);
        addToast({
          title: 'Đặt chỗ đậu thất bại (TC-08)',
          message: `Hub ${hub?.name} đã hết chỗ đậu trong khung giờ này. ${alternative ? `Gợi ý: ${alternative.name} còn ${getHubStats(alternative.hubId).availableParking} chỗ trống.` : ''}`,
          type: 'error',
        });
        return false;
      }

      const emptySpace = parkingSpaces.find((p) => p.hubId === hubId && p.status === 'empty');
      if (!emptySpace) return false;

      // Reserve space
      setParkingSpaces((prev) =>
        prev.map((p) => (p.spaceId === emptySpace.spaceId ? { ...p, status: 'reserved', reservedBy: currentUser.userId } : p))
      );

      const resId = 'RES-PK-' + Math.floor(1000 + Math.random() * 9000);
      const newRes: Reservation = {
        reservationId: resId,
        userId: currentUser.userId,
        userName: currentUser.name,
        type: 'parking',
        spaceId: emptySpace.spaceId,
        hubId,
        hubName: hub?.name || 'VinFast Hub',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
        startTime,
        durationMinutes,
        cost: 10000,
      };

      setReservations((prev) => [newRes, ...prev]);

      // If charging requested
      if (withCharging) {
        const newReq: ChargingRequest = {
          requestId: 'CHG-PVT-' + Math.floor(1000 + Math.random() * 9000),
          userId: currentUser.userId,
          userName: `${currentUser.name} (Xe cá nhân)`,
          vehicleId: 'PVT-' + (currentUser.vehiclePlate || 'EV'),
          vehicleModel: currentUser.vehicleModel || 'VinFast EV',
          vehiclePlate: currentUser.vehiclePlate || '59-B1 000.00',
          hubId,
          hubName: hub?.name || 'Hub',
          batteryLevel: 30,
          targetBattery: 90,
          requestedTime: new Date().toISOString(),
          timeSlot: `${startTime} (Trong phiên đậu)`,
          urgencyFactor: 70,
          hubPressureFactor: 60,
          priorityScore: Math.round(((100 - 30) * 0.6 + 70 * 0.3 + 60 * 0.1) * 10) / 10,
          status: 'queued',
        };
        setChargingRequests((prev) => [newReq, ...prev]);
      }

      addToast({
        title: 'Đặt chỗ đậu thành công! (TC-07)',
        message: `Đã giữ chỗ ${emptySpace.code} tại ${hub?.name} lúc ${startTime}. ${withCharging ? 'Kèm lịch sạc thông minh VinFast.' : ''}`,
        type: 'success',
      });
      return true;
    },
    [getHubStats, hubs, parkingSpaces, currentUser, addToast]
  );

  // 6. Create Charging Request
  const createChargingRequest = useCallback(
    (hubId: string, vehicleId: string, vehiclePlate: string, vehicleModel: string, batteryLevel: number, targetBattery: number, timeSlot: string): boolean => {
      const hub = hubs.find((h) => h.hubId === hubId);
      const urgencyFactor = batteryLevel < 25 ? 90 : 50;
      const hubPressureFactor = 70;
      // Formula: priorityScore = (100 - batteryLevel) * 0.6 + urgencyFactor * 0.3 + hubPressureFactor * 0.1
      const score = Math.round(((100 - batteryLevel) * 0.6 + urgencyFactor * 0.3 + hubPressureFactor * 0.1) * 10) / 10;

      const newReq: ChargingRequest = {
        requestId: 'CHG-' + Math.floor(1000 + Math.random() * 9000),
        userId: currentUser.userId,
        userName: currentUser.name,
        vehicleId,
        vehicleModel,
        vehiclePlate,
        hubId,
        hubName: hub?.name || 'VinFast Hub',
        batteryLevel,
        targetBattery,
        requestedTime: new Date().toISOString(),
        timeSlot,
        urgencyFactor,
        hubPressureFactor,
        priorityScore: score,
        status: 'queued',
      };

      setChargingRequests((prev) => [newReq, ...prev]);

      addToast({
        title: 'Đăng ký sạc thành công',
        message: `Yêu cầu sạc cho xe ${vehicleModel} (${vehiclePlate}) đã đưa vào hàng đợi với điểm ưu tiên: ${score}đ.`,
        type: 'success',
      });
      return true;
    },
    [hubs, currentUser, addToast]
  );

  // 7. Cancel Charging Request
  const cancelChargingRequest = useCallback((requestId: string) => {
    setChargingRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          if (r.assignedPointId) {
            setChargingPoints((cList) =>
              cList.map((c) => (c.pointId === r.assignedPointId ? { ...c, status: 'available', currentVehicleId: null } : c))
            );
          }
          return { ...r, status: 'cancelled' };
        }
        return r;
      })
    );
    addToast({ title: 'Đã hủy yêu cầu sạc', message: 'Yêu cầu sạc đã được loại khỏi hàng đợi.', type: 'info' });
  }, [addToast]);

  // 8. Operator: Auto Schedule Charging (TC-09, TC-10)
  const autoScheduleCharging = useCallback((): { scheduledCount: number; queuedCount: number } => {
    // Sort queued requests by priorityScore descending (TC-09: Lower battery gets higher priority)
    const queued = [...chargingRequests.filter((r) => r.status === 'queued')].sort(
      (a, b) => b.priorityScore - a.priorityScore
    );

    if (queued.length === 0) {
      addToast({ title: 'Thông báo', message: 'Không có yêu cầu sạc nào đang chờ trong hàng đợi.', type: 'info' });
      return { scheduledCount: 0, queuedCount: 0 };
    }

    let scheduledCount = 0;
    const updatedPoints = [...chargingPoints];
    const updatedRequests = [...chargingRequests];

    // For each queued request, find an available charging point in its hub
    for (const req of queued) {
      const availPointIndex = updatedPoints.findIndex(
        (p) => p.hubId === req.hubId && p.status === 'available'
      );

      if (availPointIndex !== -1) {
        // Assign!
        const assignedPoint = updatedPoints[availPointIndex];
        assignedPoint.status = 'charging';
        assignedPoint.currentVehicleId = req.vehicleId;

        const reqIndex = updatedRequests.findIndex((r) => r.requestId === req.requestId);
        if (reqIndex !== -1) {
          updatedRequests[reqIndex] = {
            ...updatedRequests[reqIndex],
            status: 'charging',
            assignedPointId: assignedPoint.pointId,
          };
          scheduledCount++;
        }
      }
    }

    setChargingPoints(updatedPoints);
    setChargingRequests(updatedRequests);

    const remainingQueued = queued.length - scheduledCount;
    addToast({
      title: 'Đã lập lịch sạc thông minh (TC-09 & TC-10)',
      message: `Đã tự động điều phối ${scheduledCount} xe vào trụ sạc theo thứ tự ưu tiên điểm số. Còn ${remainingQueued} xe tiếp tục chờ trong hàng đợi.`,
      type: 'success',
    });

    return { scheduledCount, queuedCount: remainingQueued };
  }, [chargingRequests, chargingPoints, addToast]);

  // 9. Operator: Manual Assign Charger
  const manualAssignCharger = useCallback(
    (requestId: string, pointId: string): boolean => {
      const point = chargingPoints.find((p) => p.pointId === pointId);
      if (!point || point.status !== 'available') {
        addToast({ title: 'Lỗi gán cổng sạc', message: 'Cổng sạc không khả dụng.', type: 'error' });
        return false;
      }
      const req = chargingRequests.find((r) => r.requestId === requestId);
      if (!req) return false;

      setChargingPoints((prev) =>
        prev.map((p) => (p.pointId === pointId ? { ...p, status: 'charging', currentVehicleId: req.vehicleId } : p))
      );
      setChargingRequests((prev) =>
        prev.map((r) => (r.requestId === requestId ? { ...r, status: 'charging', assignedPointId: pointId } : r))
      );

      addToast({
        title: 'Gán cổng sạc thành công',
        message: `Đã kết nối xe ${req.vehicleModel} vào trụ sạc ${point.code}.`,
        type: 'success',
      });
      return true;
    },
    [chargingPoints, chargingRequests, addToast]
  );

  // 10. Operator: Toggle Vehicle Maintenance & Status
  const toggleVehicleMaintenance = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.vehicleId === vehicleId) {
          const nextStatus: Vehicle['status'] = v.status === 'maintenance' ? 'available' : 'maintenance';
          addToast({
            title: nextStatus === 'maintenance' ? 'Chuyển sang bảo trì' : 'Đã khôi phục hoạt động',
            message: `Xe ${v.name} (${v.licensePlate}) hiện ở trạng thái: ${nextStatus}.`,
            type: nextStatus === 'maintenance' ? 'warning' : 'success',
          });
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  }, [addToast]);

  const updateVehicleStatus = useCallback(
    (vehicleId: string, status: VehicleStatus) => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.vehicleId === vehicleId) {
            addToast({
              title: 'Cập nhật trạng thái xe',
              message: `Xe ${v.name} chuyển sang trạng thái ${status}.`,
              type: 'info',
            });
            return { ...v, status };
          }
          return v;
        })
      );
    },
    [addToast]
  );

  const toggleChargingPointStatus = useCallback(
    (pointId: string) => {
      setChargingPoints((prev) =>
        prev.map((p) => {
          if (p.pointId === pointId) {
            const nextStatus: ChargingPoint['status'] = p.status === 'faulty' ? 'available' : 'faulty';
            addToast({
              title: nextStatus === 'faulty' ? 'Báo trụ sạc gặp sự cố' : 'Đã khôi phục trụ sạc',
              message: `Trụ sạc ${p.code} (${p.pointId}) hiện ở trạng thái: ${nextStatus}.`,
              type: nextStatus === 'faulty' ? 'warning' : 'success',
            });
            return { ...p, status: nextStatus };
          }
          return p;
        })
      );
    },
    [addToast]
  );

  // 11. Operator: Redistribute Vehicle
  const redistributeVehicle = useCallback(
    (vehicleId: string, targetHubId: string): boolean => {
      const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
      if (!vehicle) return false;

      if (vehicle.status === 'in-use' || vehicle.status === 'reserved') {
        addToast({
          title: 'Không thể điều phối',
          message: `Xe ${vehicle.name} đang có khách sử dụng hoặc đặt trước.`,
          type: 'error',
        });
        return false;
      }

      const sourceHub = hubs.find((h) => h.hubId === vehicle.hubId);
      const targetHub = hubs.find((h) => h.hubId === targetHubId);

      setVehicles((prev) =>
        prev.map((v) => (v.vehicleId === vehicleId ? { ...v, hubId: targetHubId } : v))
      );

      addToast({
        title: 'Điều phối thành công',
        message: `Đã chuyển xe ${vehicle.name} từ ${sourceHub?.name} sang ${targetHub?.name}.`,
        type: 'success',
      });
      return true;
    },
    [vehicles, hubs, addToast]
  );

  // 12. Operator: Incident Management
  const createIncident = useCallback(
    (incidentData: Omit<Incident, 'incidentId' | 'createdAt'>) => {
      const newIncId = 'INC-VF-' + Math.floor(1000 + Math.random() * 9000);
      const newIncident: Incident = {
        ...incidentData,
        incidentId: newIncId,
        createdAt: new Date().toISOString(),
      };

      // Mark affected entity as faulty/maintenance
      if (incidentData.entityType === 'charging-point') {
        setChargingPoints((prev) =>
          prev.map((c) => (c.pointId === incidentData.entityId ? { ...c, status: 'faulty' } : c))
        );
      } else if (incidentData.entityType === 'vehicle') {
        setVehicles((prev) =>
          prev.map((v) => (v.vehicleId === incidentData.entityId ? { ...v, status: 'maintenance' } : v))
        );
      }

      setIncidents((prev) => [newIncident, ...prev]);

      addToast({
        title: 'Ghi nhận sự cố thành công',
        message: `Sự cố ${newIncId}: ${incidentData.description}`,
        type: 'warning',
      });
    },
    [addToast]
  );

  const updateIncidentStatus = useCallback(
    (incidentId: string, status: Incident['status']) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.incidentId === incidentId) {
            if (status === 'resolved' || status === 'closed') {
              // Restore entity
              if (inc.entityType === 'charging-point') {
                setChargingPoints((cList) =>
                  cList.map((c) => (c.pointId === inc.entityId ? { ...c, status: 'available' } : c))
                );
              } else if (inc.entityType === 'vehicle') {
                setVehicles((vList) =>
                  vList.map((v) => (v.vehicleId === inc.entityId ? { ...v, status: 'available' } : v))
                );
              }
            }
            return { ...inc, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : inc.resolvedAt };
          }
          return inc;
        })
      );
      addToast({
        title: 'Cập nhật sự cố',
        message: `Sự cố ${incidentId} chuyển sang trạng thái: ${status}.`,
        type: 'info',
      });
    },
    [addToast]
  );

  // 13. What-If Simulation Engine (Section 7.18 & TC-11, TC-12)
  const runWhatIfSimulation = useCallback(
    (params: WhatIfParameters): WhatIfResult => {
      const hub = hubs.find((h) => h.hubId === params.hubId);
      const hubName = hub?.name || 'Trạm khảo sát';
      const hubStats = getHubStats(params.hubId);

      // Current vehicles at hub
      const currentAvail = hubStats.availableVehicles;
      const additionalDemand = Math.round(params.additionalUsers * params.sharedVehicleUsageRate);
      
      const deficit = Math.max(0, additionalDemand - currentAvail);
      const unserved = Math.round(deficit * 0.85);

      const brokenChargers = Math.round((hub?.totalChargingPoints || 8) * (params.brokenChargerPercent / 100));
      const effectiveChargers = Math.max(1, (hub?.totalChargingPoints || 8) - brokenChargers);
      const chargingQueueLength = Math.round(deficit * 0.4 + brokenChargers * 3);
      const estimatedWaitTimeMinutes = Math.round((chargingQueueLength / effectiveChargers) * 25);

      const projectedOccupancy = Math.min(100, Math.round(hubStats.occupancyRate + (params.additionalUsers / 45) * 40));

      let overloadLevel: WhatIfResult['overloadLevel'] = 'Normal';
      if (projectedOccupancy >= 95 || deficit >= 15) overloadLevel = 'Severe';
      else if (projectedOccupancy >= 85 || deficit >= 8) overloadLevel = 'High';
      else if (projectedOccupancy >= 70 || deficit >= 4) overloadLevel = 'Moderate';

      // Find donor hubs with surplus
      const donorHubs = hubs
        .filter((h) => h.hubId !== params.hubId)
        .map((h) => ({ hub: h, stats: getHubStats(h.hubId) }))
        .filter((h) => h.stats.availableVehicles >= 2)
        .sort((a, b) => b.stats.availableVehicles - a.stats.availableVehicles);

      const bestDonor = donorHubs[0]?.hub;

      const recommendations: WhatIfResult['recommendations'] = [];

      if (deficit > 0 && bestDonor) {
        recommendations.push({
          id: 'REC-01',
          action: `Điều động khẩn cấp xe điện từ ${bestDonor.name}`,
          description: `Chuyển ${Math.min(deficit, 6)} xe (VinFast Feliz S & Evo 200) từ ${bestDonor.name} sang ${hubName} để đáp ứng ngay đỉnh điểm giờ cao điểm.`,
          sourceHubId: bestDonor.hubId,
          targetHubId: params.hubId,
          vehiclesToMove: Math.min(deficit, 6),
        });
      }

      if (params.brokenChargerPercent > 0) {
        recommendations.push({
          id: 'REC-02',
          action: 'Kích hoạt hàng đợi sạc thông minh & điều hướng sang Hub lân cận',
          description: `Do hỏng ${brokenChargers} trụ sạc, gửi thông báo qua App hướng dẫn sinh viên sạc tại các trạm có công suất dư thừa.`,
        });
      }

      recommendations.push({
        id: 'REC-03',
        action: 'Tăng mức ưu tiên sạc cho xe có pin < 20%',
        description: 'Tự động áp dụng hệ số nhân 1.5x điểm ưu tiên sạc để quay vòng phương tiện nhanh chóng.',
      });

      return {
        hubId: params.hubId,
        hubName,
        projectedOccupancyRate: projectedOccupancy,
        vehiclesDeficit: deficit,
        unservedRequests: unserved,
        chargingQueueLength,
        estimatedWaitTimeMinutes,
        overloadLevel,
        recommendations,
      };
    },
    [hubs, getHubStats]
  );

  // Apply What-If Recommendation
  const applyWhatIfRecommendation = useCallback(
    (recId: string, sourceHubId: string, targetHubId: string, count: number) => {
      const sourceVehicles = vehicles.filter(
        (v) => v.hubId === sourceHubId && v.status === 'available'
      ).slice(0, count);

      if (sourceVehicles.length === 0) {
        addToast({ title: 'Không đủ xe để điều chuyển', message: 'Trạm nguồn không đủ xe sẵn sàng.', type: 'warning' });
        return;
      }

      const vehicleIds = sourceVehicles.map((v) => v.vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (vehicleIds.includes(v.vehicleId) ? { ...v, hubId: targetHubId } : v))
      );

      addToast({
        title: 'Đã áp dụng khuyến nghị điều phối!',
        message: `Đã tự động chuyển ${sourceVehicles.length} xe VinFast sang ${hubs.find((h) => h.hubId === targetHubId)?.name}.`,
        type: 'success',
      });
    },
    [vehicles, hubs, addToast]
  );

  // 14. Real-time Simulator Tick
  const tickSimulator = useCallback(() => {
    // Random event:
    // 1. Drain battery slightly on in-use vehicles
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.status === 'in-use' && v.batteryLevel > 5) {
          return { ...v, batteryLevel: v.batteryLevel - 1 };
        }
        if (v.status === 'charging' && v.batteryLevel < 100) {
          return { ...v, batteryLevel: Math.min(100, v.batteryLevel + 5) };
        }
        return v;
      })
    );

    addToast({
      title: 'Mô phỏng chu kỳ thời gian thực',
      message: 'Hệ sinh thái mạng lưới xe điện VinFast ĐHQG đã cập nhật trạng thái pin và trạm sạc.',
      type: 'info',
    });
  }, [addToast]);

  // Periodic simulator if enabled
  useEffect(() => {
    if (!isSimulatorRunning) return;
    const timer = setInterval(() => {
      tickSimulator();
    }, 8000);
    return () => clearInterval(timer);
  }, [isSimulatorRunning, tickSimulator]);

  // 15. Reset Data to initial
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY + '_USER');
    localStorage.removeItem(STORAGE_KEY + '_HUBS');
    localStorage.removeItem(STORAGE_KEY + '_VEHICLES');
    localStorage.removeItem(STORAGE_KEY + '_PARKING');
    localStorage.removeItem(STORAGE_KEY + '_CHARGERS');
    localStorage.removeItem(STORAGE_KEY + '_RESERVATIONS');
    localStorage.removeItem(STORAGE_KEY + '_CHARGING_REQUESTS');
    localStorage.removeItem(STORAGE_KEY + '_INCIDENTS');

    setCurrentUser(INITIAL_USERS[0]);
    setHubs(INITIAL_HUBS);
    setVehicles(INITIAL_VEHICLES);
    setParkingSpaces(INITIAL_PARKING_SPACES);
    setChargingPoints(INITIAL_CHARGING_POINTS);
    setReservations(INITIAL_RESERVATIONS);
    setChargingRequests(INITIAL_CHARGING_REQUESTS);
    setIncidents(INITIAL_INCIDENTS);

    addToast({
      title: 'Đã khôi phục dữ liệu ban đầu',
      message: 'Toàn bộ dữ liệu Hub, phương tiện VinFast, trụ sạc và sự cố đã được reset về mặc định.',
      type: 'success',
    });
  }, [addToast]);

  const value = useMemo(
    () => ({
      currentUser,
      userRole: currentUser.role,
      setRole,
      activeView,
      setActiveView,
      hubs,
      vehicles,
      parkingSpaces,
      chargingPoints,
      reservations,
      chargingRequests,
      incidents,
      settings,
      updateSettings,
      toasts,
      addToast,
      removeToast,
      isAuthenticated,
      login,
      logout,
      selectedHubId,
      setSelectedHubId,
      selectedVehicleId,
      setSelectedVehicleId,
      isDemoGuideOpen,
      setIsDemoGuideOpen,
      getHubStats,
      createVehicleReservation,
      pickupVehicle,
      returnVehicle,
      cancelReservation,
      createParkingReservation,
      createChargingRequest,
      cancelChargingRequest,
      autoScheduleCharging,
      manualAssignCharger,
      toggleVehicleMaintenance,
      updateVehicleStatus,
      redistributeVehicle,
      toggleChargingPointStatus,
      createIncident,
      updateIncidentStatus,
      runWhatIfSimulation,
      applyWhatIfRecommendation,
      isSimulatorRunning,
      setIsSimulatorRunning,
      tickSimulator,
      resetAllData,
      relocateVehicle: redistributeVehicle,
    }),
    [
      currentUser,
      setRole,
      activeView,
      hubs,
      vehicles,
      parkingSpaces,
      chargingPoints,
      reservations,
      chargingRequests,
      incidents,
      settings,
      updateSettings,
      toasts,
      addToast,
      removeToast,
      isAuthenticated,
      login,
      logout,
      selectedHubId,
      selectedVehicleId,
      isDemoGuideOpen,
      getHubStats,
      createVehicleReservation,
      pickupVehicle,
      returnVehicle,
      cancelReservation,
      createParkingReservation,
      createChargingRequest,
      cancelChargingRequest,
      autoScheduleCharging,
      manualAssignCharger,
      toggleVehicleMaintenance,
      updateVehicleStatus,
      redistributeVehicle,
      toggleChargingPointStatus,
      createIncident,
      updateIncidentStatus,
      runWhatIfSimulation,
      applyWhatIfRecommendation,
      isSimulatorRunning,
      tickSimulator,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
