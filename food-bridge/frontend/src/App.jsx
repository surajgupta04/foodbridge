import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import NGODashboard from './pages/NGODashboard';
import ProfilePage from './pages/ProfilePage';
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // user is null — not logged in
  if (!user) return <Navigate to="/login" replace />;

  // user is logged in but wrong role
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurant" element={
        <ProtectedRoute role="restaurant">
          <RestaurantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/ngo" element={
        <ProtectedRoute role="ngo">
          <NGODashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Routes>
  
  );
}