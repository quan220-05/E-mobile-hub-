import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoScriptGuideModal } from './components/common/DemoScriptGuideModal';
import { HubDetailModal } from './components/student/HubDetailModal';
import { VehicleDetailModal } from './components/student/VehicleDetailModal';
import { LoginView } from './components/common/LoginView';

// Student views
import { StudentHome } from './components/student/StudentHome';
import { HubListView } from './components/student/HubListView';
import { VehicleListView } from './components/student/VehicleListView';
import { ReservationsView } from './components/student/ReservationsView';
import { ReserveParkingView } from './components/student/ReserveParkingView';
import { ChargingRequestView } from './components/student/ChargingRequestView';

// Operator views
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { FleetManagementView } from './components/operator/FleetManagementView';
import { ChargingManagementView } from './components/operator/ChargingManagementView';
import { RedistributionView } from './components/operator/RedistributionView';
import { IncidentManagementView } from './components/operator/IncidentManagementView';
import { WhatIfSimulationView } from './components/operator/WhatIfSimulationView';
import { ReportsView } from './components/operator/ReportsView';

const MainContent: React.FC = () => {
  const { 
    isAuthenticated,
    activeView, 
    selectedHubId, 
    setSelectedHubId, 
    selectedVehicleId, 
    setSelectedVehicleId, 
    isDemoGuideOpen, 
    setIsDemoGuideOpen 
  } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <ToastContainer />
        <LoginView />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      // Student Views
      case 'student-home':
        return <StudentHome />;
      case 'student-hubs':
        return <HubListView />;
      case 'student-vehicles':
        return <VehicleListView />;
      case 'student-reservations':
        return <ReservationsView />;
      case 'student-reserve-parking':
        return <ReserveParkingView />;
      case 'student-charging':
        return <ChargingRequestView />;

      // Operator Views
      case 'operator-dashboard':
        return <OperatorDashboard />;
      case 'operator-hubs':
        return <HubListView />;
      case 'operator-fleet':
        return <FleetManagementView />;
      case 'operator-charging':
        return <ChargingManagementView />;
      case 'operator-redistribution':
        return <RedistributionView />;
      case 'operator-incidents':
        return <IncidentManagementView />;
      case 'operator-whatif':
        return <WhatIfSimulationView />;
      case 'operator-reports':
        return <ReportsView />;

      default:
        return <StudentHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderView()}
      </main>

      {/* Footer with VinFast & VNU-HCM credit */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">VinFast Smart E-Mobility Hub</span>
            <span>•</span>
            <span>Khu đô thị Đại học Quốc gia TP.HCM (VNU-HCM)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDemoGuideOpen(true)}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Kịch Bản Demo Giảng Viên (TC-01 → TC-12)
            </button>
            <span>•</span>
            <span>VinFast DrgnFly • Evo 200 • Feliz S • Klara S • VF 3</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedHubId && (
        <HubDetailModal hubId={selectedHubId} onClose={() => setSelectedHubId(null)} />
      )}

      {selectedVehicleId && (
        <VehicleDetailModal vehicleId={selectedVehicleId} onClose={() => setSelectedVehicleId(null)} />
      )}

      <DemoScriptGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
