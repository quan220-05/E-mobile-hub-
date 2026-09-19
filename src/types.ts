export type UserRole = 'student' | 'private_ev_student' | 'operator';

export interface User {
  userId: string;
  name: string;
  role: UserRole;
  email: string;
  studentId?: string;
  phone?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
}

export interface Hub {
  hubId: string;
  name: string;
  location: string;
  shortDesc: string;
  totalParkingSpaces: number;
  totalChargingPoints: number;
  isActive: boolean;
  latitude: number;
  longitude: number;
  featured?: boolean;
  image?: string;
}

export type ParkingStatus = 'empty' | 'reserved' | 'occupied' | 'maintenance';

export interface ParkingSpace {
  spaceId: string;
  hubId: string;
  code: string;
  status: ParkingStatus;
  reservedBy: string | null;
  currentVehicleId: string | null;
  vehicleTypeAllowed: 'bike' | 'motorcycle' | 'car' | 'all';
}

export type ChargingPointStatus = 'available' | 'charging' | 'faulty' | 'maintenance';

export interface ChargingPoint {
  pointId: string;
  hubId: string;
  code: string;
  status: ChargingPointStatus;
  powerRate: number; // in kW, e.g., 3.3, 7.4, 30, 60
  connectorType: 'VinFast SuperSocket' | 'Type 2 AC (7.4kW)' | 'CCS2 DC (30kW)' | 'CCS2 DC Ultra (60kW)';
  currentVehicleId: string | null;
}

export type VehicleCategory = 'electric-bike' | 'electric-motorcycle' | 'electric-car';
export type VehicleStatus = 'available' | 'reserved' | 'in-use' | 'waiting-for-charging' | 'charging' | 'maintenance';

export interface Vehicle {
  vehicleId: string;
  name: string;
  modelName: string; // e.g., "DrgnFly", "Evo 200", "Feliz S", "VF 3", "VF 5 Plus"
  vinfastSeries: string;
  category: VehicleCategory;
  hubId: string;
  batteryLevel: number; // 0 - 100%
  status: VehicleStatus;
  licensePlate: string;
  color: string;
  rangeKm: number;
  maxSpeed: number; // km/h
  motorPower: string;
  rentalPricePerHour: number; // VND/hour
  imageUrl?: string;
  currentUserId?: string | null;
}

export type ReservationType = 'vehicle' | 'parking';
export type ReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'expired';

export interface Reservation {
  reservationId: string;
  userId: string;
  userName: string;
  type: ReservationType;
  vehicleId?: string;
  spaceId?: string;
  hubId: string;
  hubName: string;
  status: ReservationStatus;
  createdAt: string;
  expiresAt: string; // usually 15 mins from createdAt for vehicle booking
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  cost?: number;
  pickupOtp?: string;
}

export type ChargingRequestStatus = 'queued' | 'scheduled' | 'charging' | 'completed' | 'cancelled';

export interface ChargingRequest {
  requestId: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehicleModel: string;
  vehiclePlate: string;
  hubId: string;
  hubName: string;
  batteryLevel: number;
  targetBattery: number;
  requestedTime: string;
  timeSlot?: string;
  urgencyFactor: number; // 0-100
  hubPressureFactor: number; // 0-100
  priorityScore: number; // calculated using markdown formula
  status: ChargingRequestStatus;
  assignedPointId?: string;
}

export type IncidentType = 
  | 'vehicle-failure' 
  | 'charging-point-failure' 
  | 'parking-full' 
  | 'reservation-conflict' 
  | 'system-alert';

export type IncidentStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  incidentId: string;
  type: IncidentType;
  hubId: string;
  hubName: string;
  entityType: 'vehicle' | 'charging-point' | 'parking-space' | 'hub';
  entityId: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdAt: string;
  resolvedAt?: string;
  reporter: string;
}

export interface WhatIfParameters {
  hubId: string;
  additionalUsers: number;
  sharedVehicleUsageRate: number; // 0.1 - 1.0
  brokenChargerPercent: number; // 0 - 100%
  timeWindow: string;
}

export interface WhatIfResult {
  hubId: string;
  hubName: string;
  projectedOccupancyRate: number;
  vehiclesDeficit: number;
  unservedRequests: number;
  chargingQueueLength: number;
  estimatedWaitTimeMinutes: number;
  overloadLevel: 'Normal' | 'Moderate' | 'High' | 'Severe';
  recommendations: Array<{
    id: string;
    action: string;
    description: string;
    sourceHubId?: string;
    targetHubId?: string;
    vehiclesToMove?: number;
    applied?: boolean;
  }>;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  viewMode: 'compact' | 'detailed';
  fontSize: 'small' | 'medium' | 'large';
  alertsEnabled: boolean;
  autoSimulator: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}
