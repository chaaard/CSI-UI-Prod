import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hooks/UseAuth';

interface ProtectedRouteProps {
  roles: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated } = useAuth();
  const getRoleId = localStorage.getItem("roleId");
  const roleId = getRoleId !== null ? parseInt(getRoleId, 10) : 0;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!roles.includes(roleId)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
