import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store';
import { MainLayout } from '@/components/layout/MainLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Home from '@/pages/Home';
import InsuranceCenter from '@/pages/insurance/InsuranceCenter';
import PolicyManagement from '@/pages/policy/PolicyManagement';
import ClaimCenter from '@/pages/claim/ClaimCenter';
import HealthCenter from '@/pages/health/HealthCenter';
import MemberCenter from '@/pages/member/MemberCenter';
import AgentDashboard from '@/pages/agent/AgentDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Profile from '@/pages/profile/Profile';

const ProtectedRoute = ({ requiredRole }: { requiredRole?: 'customer' | 'agent' | 'admin' }) => {
  const { currentUser } = useAppStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Home />
          },
          {
            path: '/insurance',
            element: <InsuranceCenter />
          },
          {
            path: '/policies',
            element: <PolicyManagement />
          },
          {
            path: '/claims',
            element: <ClaimCenter />
          },
          {
            path: '/health',
            element: <HealthCenter />
          },
          {
            path: '/member',
            element: <MemberCenter />
          },
          {
            path: '/profile',
            element: <Profile />
          }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute requiredRole="agent" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/agent',
            element: <AgentDashboard />
          }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboard />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];
