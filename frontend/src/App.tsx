import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import BedsList from './components/BedsList';
import EventsList from './components/EventsList';
import CommandCenter from './components/CommandCenter';
import AuditTrail from './components/AuditTrail';
import Reports from './components/Reports';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminDashboard from './components/AdminDashboard';
import CapacityPlanning from './components/CapacityPlanning';
import WorkflowOrchestration from './components/WorkflowOrchestration';
import PredictiveOperations from './components/PredictiveOperations';
import SimulationCenter from './components/SimulationCenter';
import ControlTower from './components/ControlTower';
import WorkloadPrioritization from './components/WorkloadPrioritization';
import FacilityBenchmarking from './components/FacilityBenchmarking';
import NotificationCenter from './components/NotificationCenter';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Phase24Evaluation from './components/Phase24Evaluation';
import { AppShell } from './components/layout/AppShell';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
          <Route path="/beds" element={<ProtectedRoute><AppShell><BedsList /></AppShell></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><AppShell><EventsList /></AppShell></ProtectedRoute>} />
          <Route path="/control-tower" element={<ProtectedRoute><AppShell><ControlTower /></AppShell></ProtectedRoute>} />
          <Route path="/command-center" element={<ProtectedRoute><AppShell><CommandCenter /></AppShell></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><AppShell><AuditTrail /></AppShell></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><AppShell><NotificationCenter /></AppShell></ProtectedRoute>} />
          <Route path="/executive" element={<ProtectedRoute><AppShell><ExecutiveDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/evaluation" element={<ProtectedRoute><AppShell><Phase24Evaluation /></AppShell></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppShell><Reports /></AppShell></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AppShell><AdminDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/capacity" element={<ProtectedRoute><AppShell><CapacityPlanning /></AppShell></ProtectedRoute>} />
          <Route path="/orchestration" element={<ProtectedRoute><AppShell><WorkflowOrchestration /></AppShell></ProtectedRoute>} />
          <Route path="/predictive-operations" element={<ProtectedRoute><AppShell><PredictiveOperations /></AppShell></ProtectedRoute>} />
          <Route path="/simulation" element={<ProtectedRoute><AppShell><SimulationCenter /></AppShell></ProtectedRoute>} />
          <Route path="/workload" element={<ProtectedRoute><AppShell><WorkloadPrioritization /></AppShell></ProtectedRoute>} />
          <Route path="/benchmarking" element={<ProtectedRoute><AppShell><FacilityBenchmarking /></AppShell></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
