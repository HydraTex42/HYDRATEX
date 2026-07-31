import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnlockPage from './pages/UnlockPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function RequireAuth({ children }) {
  const { token, isUnlocked } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!isUnlocked) return <UnlockPage />;
  return children;
}

function RedirectIfAuthed({ children }) {
  const { token, isUnlocked } = useAuth();
  if (token && isUnlocked) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
      <Route path="/register" element={<RedirectIfAuthed><RegisterPage /></RedirectIfAuthed>} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
