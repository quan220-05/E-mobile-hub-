import { 
  Hub, 
  Vehicle, 
  ParkingSpace, 
  ChargingPoint, 
  Reservation, 
  ChargingRequest, 
  Incident, 
  User 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    userId: 'U001',
    name: 'Nguyễn Văn An',
    role: 'student',
    email: 'an.nguyen@hcmut.edu.vn',
    studentId: '22110088',
    phone: '0901234567',
  },
  {
    userId: 'U002',
    name: 'Trần Thị Mai',
    role: 'private_ev_student',
    email: 'mai.tran@hcmut.edu.vn',
    studentId: '23120199',
    phone: '0912345678',
    vehiclePlate: '59-B1 889.23',
    vehicleModel: 'VinFast Feliz S (Xám)',
  },
  {
    userId: 'U003',
    name: 'Lê Hoàng Minh (Admin)',
    role: 'operator',
    email: 'admin@hcmut.edu.vn',
    phone: '0988776655',
  }
];

export const INITIAL_HUBS: Hub[] = [
  {
    hubId: 'H01',
    name: 'Metro Hub (Ga Metro ĐHQG)',
    location: 'Cửa ngõ Ga Metro Tuyến 1, Đường Song Hành Xa Lộ Hà Nội',
    shortDesc: 'Nút giao thông huyết mạch đón đầu luồng sinh viên từ Metro Bến Thành - Suối Tiên',
    totalParkingSpaces: 45,
    totalChargingPoints: 10,
    isActive: true,
    latitude: 10.8756,
    longitude: 106.8012,
    featured: true,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
  },
  {
    hubId: 'H02',
    name: 'Ký Túc Xá Khu A Hub',
    location: 'Quảng trường Cột cờ KTX Khu A, Đường Tạ Quang Bửu',
    shortDesc: 'Phục vụ hơn 25.000 sinh viên lưu trú, trạm tập kết phương tiện lớn nhất',
    totalParkingSpaces: 50,
    totalChargingPoints: 12,
    isActive: true,
    latitude: 10.8791,
    longitude: 106.8045,
    featured: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  {
    hubId: 'H03',
    name: 'Ký Túc Xá Khu B Hub',
    location: 'Cổng chính KTX Khu B, Đường Tô Vĩnh Diện, Dĩ An',
    shortDesc: 'Khu phức hợp KTX sinh viên đông đảo với bãi sạc pin xe máy điện thông minh',
    totalParkingSpaces: 40,
    totalChargingPoints: 8,
    isActive: true,
    latitude: 10.8845,
    longitude: 106.7818,
    featured: true,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80'
  },
  {
    hubId: 'H04',
    name: 'Thư Viện Trung Tâm & Điều Hành Hub',
    location: 'Trục đường Lê Quý Đôn, cạnh Thư viện Trung tâm ĐHQG',
    shortDesc: 'Khu hành chính và học tập trung tâm, điểm kết nối liên trường thành viên',
    totalParkingSpaces: 30,
    totalChargingPoints: 6,
    isActive: true,
    latitude: 10.8702,
    longitude: 106.8030,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'
  },
  {
    hubId: 'H05',
    name: 'ĐH Bách Khoa (Cơ sở 2) Hub',
    location: 'Khuôn viên ĐH Bách Khoa Cơ sở Dĩ An, Đường số 1',
    shortDesc: 'Khuôn viên khối kỹ thuật công nghệ cao với trạm sạc nhanh DC siêu tốc',
    totalParkingSpaces: 35,
    totalChargingPoints: 8,
    isActive: true,
    latitude: 10.8808,
    longitude: 106.8068,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    hubId: 'H06',
    name: 'ĐH Công Nghệ Thông Tin (UIT) Hub',
    location: 'Khu phố 6, P. Linh Trung, cạnh ĐH Kinh Tế - Luật & UIT',
    shortDesc: 'Khu vực năng động công nghệ cao, nhiều trạm xe đạp trợ lực DrgnFly',
    totalParkingSpaces: 25,
    totalChargingPoints: 6,
    isActive: true,
    latitude: 10.8700,
    longitude: 106.8039,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  // --- E-BIKES (VinFast DrgnFly) ---
  {
    vehicleId: 'VF-DRG-101',
    name: 'VinFast DrgnFly #01',
    modelName: 'DrgnFly',
    vinfastSeries: 'E-Bike Thể Thao',
    category: 'electric-bike',
    hubId: 'H01',
    batteryLevel: 92,
    status: 'available',
    licensePlate: 'EB-DF-01',
    color: 'Đen Mờ (Matte Black)',
    rangeKm: 105,
    maxSpeed: 45,
    motorPower: '350W Bafang Trục Sau',
    rentalPricePerHour: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-DRG-102',
    name: 'VinFast DrgnFly #02',
    modelName: 'DrgnFly',
    vinfastSeries: 'E-Bike Thể Thao',
    category: 'electric-bike',
    hubId: 'H01',
    batteryLevel: 78,
    status: 'available',
    licensePlate: 'EB-DF-02',
    color: 'Vàng Đồng Kim Loại',
    rangeKm: 85,
    maxSpeed: 45,
    motorPower: '350W Bafang Trục Sau',
    rentalPricePerHour: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-DRG-103',
    name: 'VinFast DrgnFly #03',
    modelName: 'DrgnFly',
    vinfastSeries: 'E-Bike Thể Thao',
    category: 'electric-bike',
    hubId: 'H02',
    batteryLevel: 15,
    status: 'waiting-for-charging',
    licensePlate: 'EB-DF-03',
    color: 'Bạc Titan',
    rangeKm: 18,
    maxSpeed: 45,
    motorPower: '350W Bafang Trục Sau',
    rentalPricePerHour: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-DRG-104',
    name: 'VinFast DrgnFly #04',
    modelName: 'DrgnFly',
    vinfastSeries: 'E-Bike Thể Thao',
    category: 'electric-bike',
    hubId: 'H06',
    batteryLevel: 88,
    status: 'available',
    licensePlate: 'EB-DF-04',
    color: 'Đỏ Ruby',
    rangeKm: 98,
    maxSpeed: 45,
    motorPower: '350W Bafang Trục Sau',
    rentalPricePerHour: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=500&q=80'
  },

  // --- E-MOTORCYCLES (VinFast Evo 200, Feliz S, Klara S, Vento S) ---
  {
    vehicleId: 'VF-EVO-201',
    name: 'VinFast Evo 200 #01',
    modelName: 'Evo 200',
    vinfastSeries: 'E-Scooter 203km',
    category: 'electric-motorcycle',
    hubId: 'H01',
    batteryLevel: 86,
    status: 'available',
    licensePlate: '59-MD1 102.34',
    color: 'Đỏ Tươi (Crimson Red)',
    rangeKm: 203,
    maxSpeed: 70,
    motorPower: '1500W Inhub',
    rentalPricePerHour: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-EVO-202',
    name: 'VinFast Evo 200 #02',
    modelName: 'Evo 200',
    vinfastSeries: 'E-Scooter 203km',
    category: 'electric-motorcycle',
    hubId: 'H01',
    batteryLevel: 64,
    status: 'available',
    licensePlate: '59-MD1 102.89',
    color: 'Xanh Rêu (Olive)',
    rangeKm: 145,
    maxSpeed: 70,
    motorPower: '1500W Inhub',
    rentalPricePerHour: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-EVO-203',
    name: 'VinFast Evo 200 Lite',
    modelName: 'Evo 200 Lite',
    vinfastSeries: 'E-Scooter Sinh Viên',
    category: 'electric-motorcycle',
    hubId: 'H02',
    batteryLevel: 94,
    status: 'available',
    licensePlate: '59-MD1 203.11',
    color: 'Trắng Ngọc Trai',
    rangeKm: 205,
    maxSpeed: 49,
    motorPower: '1200W Tiết Kiệm',
    rentalPricePerHour: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-FLZ-301',
    name: 'VinFast Feliz S #01',
    modelName: 'Feliz S',
    vinfastSeries: 'E-Scooter Thanh Lịch',
    category: 'electric-motorcycle',
    hubId: 'H02',
    batteryLevel: 90,
    status: 'available',
    licensePlate: '59-MD1 304.56',
    color: 'Bạc Ánh Kim (Silver Metallic)',
    rangeKm: 198,
    maxSpeed: 78,
    motorPower: '1800W Inhub',
    rentalPricePerHour: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-FLZ-302',
    name: 'VinFast Feliz S #02',
    modelName: 'Feliz S',
    vinfastSeries: 'E-Scooter Thanh Lịch',
    category: 'electric-motorcycle',
    hubId: 'H03',
    batteryLevel: 72,
    status: 'available',
    licensePlate: '59-MD1 304.88',
    color: 'Xanh Đậm VinFast',
    rangeKm: 155,
    maxSpeed: 78,
    motorPower: '1800W Inhub',
    rentalPricePerHour: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-KLA-401',
    name: 'VinFast Klara S (2022)',
    modelName: 'Klara S',
    vinfastSeries: 'E-Scooter Cao Cấp',
    category: 'electric-motorcycle',
    hubId: 'H04',
    batteryLevel: 55,
    status: 'available',
    licensePlate: '59-MD1 405.12',
    color: 'Đen Bóng Sang Trọng',
    rangeKm: 194,
    maxSpeed: 78,
    motorPower: '1800W Inhub',
    rentalPricePerHour: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-VEN-501',
    name: 'VinFast Vento S',
    modelName: 'Vento S',
    vinfastSeries: 'Smart E-Scooter IPM',
    category: 'electric-motorcycle',
    hubId: 'H05',
    batteryLevel: 82,
    status: 'available',
    licensePlate: '59-MD1 506.78',
    color: 'Vàng Ánh Kim',
    rangeKm: 160,
    maxSpeed: 89,
    motorPower: '3000W Động cơ IPM',
    rentalPricePerHour: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-THE-601',
    name: 'VinFast Theon S (Flagship)',
    modelName: 'Theon S',
    vinfastSeries: 'Flagship Super E-Scooter',
    category: 'electric-motorcycle',
    hubId: 'H03',
    batteryLevel: 12,
    status: 'waiting-for-charging',
    licensePlate: '59-MD1 607.99',
    color: 'Xám Titan Mờ',
    rangeKm: 25,
    maxSpeed: 99,
    motorPower: '7100W Giữa Trục',
    rentalPricePerHour: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-FLZ-303',
    name: 'VinFast Feliz S #03 (Bảo trì)',
    modelName: 'Feliz S',
    vinfastSeries: 'E-Scooter Thanh Lịch',
    category: 'electric-motorcycle',
    hubId: 'H02',
    batteryLevel: 45,
    status: 'maintenance',
    licensePlate: '59-MD1 305.10',
    color: 'Đỏ Tươi',
    rangeKm: 90,
    maxSpeed: 78,
    motorPower: '1800W Inhub',
    rentalPricePerHour: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80'
  },

  // --- ELECTRIC CARS (VinFast VF 3, VF 5 Plus, VF 6, VF 7, VF 8) ---
  {
    vehicleId: 'VF-CAR-031',
    name: 'VinFast VF 3 (Mini e-SUV)',
    modelName: 'VF 3',
    vinfastSeries: 'Mini e-SUV Tiên Phong',
    category: 'electric-car',
    hubId: 'H01',
    batteryLevel: 88,
    status: 'available',
    licensePlate: '51K-333.12',
    color: 'Vàng Chanh Solar Yellow',
    rangeKm: 215,
    maxSpeed: 100,
    motorPower: '32 kW (43 mã lực)',
    rentalPricePerHour: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-CAR-032',
    name: 'VinFast VF 3 (Mini e-SUV)',
    modelName: 'VF 3',
    vinfastSeries: 'Mini e-SUV Tiên Phong',
    category: 'electric-car',
    hubId: 'H02',
    batteryLevel: 76,
    status: 'available',
    licensePlate: '51K-333.45',
    color: 'Xanh Dương Cổ Điển',
    rangeKm: 185,
    maxSpeed: 100,
    motorPower: '32 kW (43 mã lực)',
    rentalPricePerHour: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-CAR-051',
    name: 'VinFast VF 5 Plus',
    modelName: 'VF 5 Plus',
    vinfastSeries: 'A-SUV Đô Thị Năng Động',
    category: 'electric-car',
    hubId: 'H04',
    batteryLevel: 95,
    status: 'available',
    licensePlate: '51K-505.78',
    color: 'Cam Nóc Trắng Sunset',
    rangeKm: 326,
    maxSpeed: 130,
    motorPower: '100 kW (134 mã lực)',
    rentalPricePerHour: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80'
  },
  {
    vehicleId: 'VF-CAR-061',
    name: 'VinFast VF 6 Plus',
    modelName: 'VF 6',
    vinfastSeries: 'B-SUV Thông Minh Đỉnh Cao',
    category: 'electric-car',
    hubId: 'H05',
    batteryLevel: 68,
    status: 'available',
    licensePlate: '51K-606.99',
    color: 'Xanh VinFast Blue',
    rangeKm: 381,
    maxSpeed: 160,
    motorPower: '150 kW (201 mã lực)',
    rentalPricePerHour: 130000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_PARKING_SPACES: ParkingSpace[] = [
  // H01 (Metro Hub)
  { spaceId: 'P-H01-01', hubId: 'H01', code: 'P01-MTR', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-DRG-101', vehicleTypeAllowed: 'bike' },
  { spaceId: 'P-H01-02', hubId: 'H01', code: 'P02-MTR', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-DRG-102', vehicleTypeAllowed: 'bike' },
  { spaceId: 'P-H01-03', hubId: 'H01', code: 'P03-MTR', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-EVO-201', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H01-04', hubId: 'H01', code: 'P04-MTR', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-EVO-202', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H01-05', hubId: 'H01', code: 'P05-MTR', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-CAR-031', vehicleTypeAllowed: 'car' },
  { spaceId: 'P-H01-06', hubId: 'H01', code: 'P06-MTR', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },
  { spaceId: 'P-H01-07', hubId: 'H01', code: 'P07-MTR', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },
  { spaceId: 'P-H01-08', hubId: 'H01', code: 'P08-MTR', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'car' },

  // H02 (KTX Khu A)
  { spaceId: 'P-H02-01', hubId: 'H02', code: 'P01-KTXA', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-EVO-203', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H02-02', hubId: 'H02', code: 'P02-KTXA', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-FLZ-301', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H02-03', hubId: 'H02', code: 'P03-KTXA', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-CAR-032', vehicleTypeAllowed: 'car' },
  { spaceId: 'P-H02-04', hubId: 'H02', code: 'P04-KTXA', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },
  { spaceId: 'P-H02-05', hubId: 'H02', code: 'P05-KTXA', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },
  { spaceId: 'P-H02-06', hubId: 'H02', code: 'P06-KTXA', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },

  // H03 (KTX Khu B)
  { spaceId: 'P-H03-01', hubId: 'H03', code: 'P01-KTXB', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-FLZ-302', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H03-02', hubId: 'H03', code: 'P02-KTXB', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-THE-601', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H03-03', hubId: 'H03', code: 'P03-KTXB', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },
  { spaceId: 'P-H03-04', hubId: 'H03', code: 'P04-KTXB', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'car' },

  // H04 (Thư Viện)
  { spaceId: 'P-H04-01', hubId: 'H04', code: 'P01-LIB', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-KLA-401', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H04-02', hubId: 'H04', code: 'P02-LIB', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-CAR-051', vehicleTypeAllowed: 'car' },
  { spaceId: 'P-H04-03', hubId: 'H04', code: 'P03-LIB', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },

  // H05 (Bách Khoa)
  { spaceId: 'P-H05-01', hubId: 'H05', code: 'P01-BK', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-VEN-501', vehicleTypeAllowed: 'motorcycle' },
  { spaceId: 'P-H05-02', hubId: 'H05', code: 'P02-BK', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-CAR-061', vehicleTypeAllowed: 'car' },
  { spaceId: 'P-H05-03', hubId: 'H05', code: 'P03-BK', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' },

  // H06 (UIT)
  { spaceId: 'P-H06-01', hubId: 'H06', code: 'P01-UIT', status: 'occupied', reservedBy: null, currentVehicleId: 'VF-DRG-104', vehicleTypeAllowed: 'bike' },
  { spaceId: 'P-H06-02', hubId: 'H06', code: 'P02-UIT', status: 'empty', reservedBy: null, currentVehicleId: null, vehicleTypeAllowed: 'all' }
];

export const INITIAL_CHARGING_POINTS: ChargingPoint[] = [
  // H01 Metro Hub
  { pointId: 'CP-H01-01', hubId: 'H01', code: 'VF-CP01-MTR', status: 'available', powerRate: 7.4, connectorType: 'Type 2 AC (7.4kW)', currentVehicleId: null },
  { pointId: 'CP-H01-02', hubId: 'H01', code: 'VF-CP02-MTR', status: 'available', powerRate: 30, connectorType: 'CCS2 DC (30kW)', currentVehicleId: null },
  { pointId: 'CP-H01-03', hubId: 'H01', code: 'VF-CP03-MTR', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },
  { pointId: 'CP-H01-04', hubId: 'H01', code: 'VF-CP04-MTR', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },
  { pointId: 'CP-H01-05', hubId: 'H01', code: 'VF-CP05-MTR', status: 'faulty', powerRate: 60, connectorType: 'CCS2 DC Ultra (60kW)', currentVehicleId: null },

  // H02 KTX Khu A
  { pointId: 'CP-H02-01', hubId: 'H02', code: 'VF-CP01-KTXA', status: 'charging', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: 'VF-DRG-103' },
  { pointId: 'CP-H02-02', hubId: 'H02', code: 'VF-CP02-KTXA', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },
  { pointId: 'CP-H02-03', hubId: 'H02', code: 'VF-CP03-KTXA', status: 'available', powerRate: 7.4, connectorType: 'Type 2 AC (7.4kW)', currentVehicleId: null },
  { pointId: 'CP-H02-04', hubId: 'H02', code: 'VF-CP04-KTXA', status: 'available', powerRate: 30, connectorType: 'CCS2 DC (30kW)', currentVehicleId: null },

  // H03 KTX Khu B
  { pointId: 'CP-H03-01', hubId: 'H03', code: 'VF-CP01-KTXB', status: 'charging', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: 'VF-THE-601' },
  { pointId: 'CP-H03-02', hubId: 'H03', code: 'VF-CP02-KTXB', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },
  { pointId: 'CP-H03-03', hubId: 'H03', code: 'VF-CP03-KTXB', status: 'available', powerRate: 7.4, connectorType: 'Type 2 AC (7.4kW)', currentVehicleId: null },

  // H04 Thư viện
  { pointId: 'CP-H04-01', hubId: 'H04', code: 'VF-CP01-LIB', status: 'available', powerRate: 7.4, connectorType: 'Type 2 AC (7.4kW)', currentVehicleId: null },
  { pointId: 'CP-H04-02', hubId: 'H04', code: 'VF-CP02-LIB', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },

  // H05 Bách Khoa
  { pointId: 'CP-H05-01', hubId: 'H05', code: 'VF-CP01-BK', status: 'available', powerRate: 30, connectorType: 'CCS2 DC (30kW)', currentVehicleId: null },
  { pointId: 'CP-H05-02', hubId: 'H05', code: 'VF-CP02-BK', status: 'available', powerRate: 3.3, connectorType: 'VinFast SuperSocket', currentVehicleId: null },

  // H06 UIT
  { pointId: 'CP-H06-01', hubId: 'H06', code: 'VF-CP01-UIT', status: 'available', powerRate: 7.4, connectorType: 'Type 2 AC (7.4kW)', currentVehicleId: null }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    reservationId: 'RES-VNU-01',
    userId: 'U001',
    userName: 'Nguyễn Văn An',
    type: 'vehicle',
    vehicleId: 'VF-EVO-201',
    hubId: 'H01',
    hubName: 'Metro Hub (Ga Metro ĐHQG)',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    durationMinutes: 15,
    pickupOtp: 'VF-8924',
    cost: 15000
  },
  {
    reservationId: 'RES-VNU-02',
    userId: 'U002',
    userName: 'Trần Thị Mai',
    type: 'parking',
    spaceId: 'P-H02-04',
    hubId: 'H02',
    hubName: 'Ký Túc Xá Khu A Hub',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    startTime: '14:00',
    endTime: '17:00',
    durationMinutes: 180,
    cost: 10000
  }
];

export const INITIAL_CHARGING_REQUESTS: ChargingRequest[] = [
  {
    requestId: 'CHG-VF-001',
    userId: 'U001',
    userName: 'Nguyễn Văn An',
    vehicleId: 'VF-DRG-103',
    vehicleModel: 'VinFast DrgnFly',
    vehiclePlate: 'EB-DF-03',
    hubId: 'H02',
    hubName: 'Ký Túc Xá Khu A Hub',
    batteryLevel: 15,
    targetBattery: 90,
    requestedTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeSlot: '08:30 - 10:30',
    urgencyFactor: 85,
    hubPressureFactor: 60,
    priorityScore: 82.5, // (100 - 15) * 0.6 + 85 * 0.3 + 60 * 0.1 = 51 + 25.5 + 6 = 82.5
    status: 'charging',
    assignedPointId: 'CP-H02-01'
  },
  {
    requestId: 'CHG-VF-002',
    userId: 'U002',
    userName: 'Trần Thị Mai',
    vehicleId: 'VF-THE-601',
    vehicleModel: 'VinFast Theon S',
    vehiclePlate: '59-MD1 607.99',
    hubId: 'H03',
    hubName: 'Ký Túc Xá Khu B Hub',
    batteryLevel: 12,
    targetBattery: 100,
    requestedTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timeSlot: '09:00 - 11:30',
    urgencyFactor: 90,
    hubPressureFactor: 70,
    priorityScore: 86.8, // (100 - 12) * 0.6 + 90 * 0.3 + 70 * 0.1 = 52.8 + 27 + 7 = 86.8
    status: 'charging',
    assignedPointId: 'CP-H03-01'
  },
  {
    requestId: 'CHG-VF-003',
    userId: 'U002',
    userName: 'Trần Thị Mai (Xe cá nhân)',
    vehicleId: 'PVT-VF-01',
    vehicleModel: 'VinFast Feliz S',
    vehiclePlate: '59-B1 889.23',
    hubId: 'H01',
    hubName: 'Metro Hub (Ga Metro ĐHQG)',
    batteryLevel: 28,
    targetBattery: 85,
    requestedTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timeSlot: '11:00 - 12:30',
    urgencyFactor: 60,
    hubPressureFactor: 80,
    priorityScore: 69.2, // (100 - 28) * 0.6 + 60 * 0.3 + 80 * 0.1 = 43.2 + 18 + 8 = 69.2
    status: 'queued'
  },
  {
    requestId: 'CHG-VF-004',
    userId: 'U001',
    userName: 'Lê Văn Cường',
    vehicleId: 'VF-EVO-202',
    vehicleModel: 'VinFast Evo 200',
    vehiclePlate: '59-MD1 102.89',
    hubId: 'H01',
    hubName: 'Metro Hub (Ga Metro ĐHQG)',
    batteryLevel: 64,
    targetBattery: 95,
    requestedTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    timeSlot: '13:00 - 14:00',
    urgencyFactor: 40,
    hubPressureFactor: 80,
    priorityScore: 41.6, // (100 - 64) * 0.6 + 40 * 0.3 + 80 * 0.1 = 21.6 + 12 + 8 = 41.6
    status: 'queued'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    incidentId: 'INC-VF-001',
    type: 'charging-point-failure',
    hubId: 'H01',
    hubName: 'Metro Hub (Ga Metro ĐHQG)',
    entityType: 'charging-point',
    entityId: 'CP-H01-05',
    description: 'Trụ sạc nhanh CCS2 DC 60kW báo lỗi cảm biến nhiệt độ đầu nối cáp',
    status: 'open',
    severity: 'high',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reporter: 'Kỹ thuật viên Trực ban Metro Hub'
  },
  {
    incidentId: 'INC-VF-002',
    type: 'vehicle-failure',
    hubId: 'H02',
    hubName: 'Ký Túc Xá Khu A Hub',
    entityType: 'vehicle',
    entityId: 'VF-FLZ-303',
    description: 'Xe máy điện Feliz S báo mã lỗi phanh kết hợp CBS và cần cân chỉnh phuộc trước',
    status: 'in-progress',
    severity: 'medium',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    reporter: 'Sinh viên phản ánh qua app'
  }
];
