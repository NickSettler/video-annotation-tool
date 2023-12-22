import { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { routesPaths } from './index';

export const PublicOnlyRoute = (): JSX.Element => {
  const { accessToken } = useAuth();

  if (accessToken) return <Navigate to={routesPaths.studio.root} replace />;

  return <Outlet />;
};
