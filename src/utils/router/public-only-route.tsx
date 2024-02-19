import { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { routesPaths } from './index';

const PublicOnlyRoute = (): JSX.Element => {
  const { accessToken } = useAuth();

  if (accessToken) return <Navigate to={routesPaths.dashboard.root} replace />;

  return <Outlet />;
};

export default PublicOnlyRoute;
