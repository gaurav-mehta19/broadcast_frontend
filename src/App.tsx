import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { UploadContent } from '@/pages/teacher/UploadContent';
import { MyContent } from '@/pages/teacher/MyContent';
import { PrincipalDashboard } from '@/pages/principal/PrincipalDashboard';
import { PendingApprovals } from '@/pages/principal/PendingApprovals';
import { AllContent } from '@/pages/principal/AllContent';
import { LiveBroadcast } from '@/pages/public/LiveBroadcast';
import { useAuth } from '@/hooks/useAuth';

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'TEACHER' ? '/teacher/dashboard' : '/principal/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/live/:teacherId" element={<LiveBroadcast />} />
      <Route path="/live/:teacherId/:subject" element={<LiveBroadcast />} />

      <Route element={<ProtectedRoute allowedRoles={['TEACHER']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/upload" element={<UploadContent />} />
        <Route path="/teacher/content" element={<MyContent />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['PRINCIPAL']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
        <Route path="/principal/pending" element={<PendingApprovals />} />
        <Route path="/principal/all" element={<AllContent />} />
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
