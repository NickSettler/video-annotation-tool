import { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { routesPaths } from './index';

const ProtectedRoute = (): JSX.Element => {
  const { accessToken } = useAuth();

  if (!accessToken)
    return (
      <Navigate
        to={[routesPaths.auth.root, routesPaths.auth.login].join('/')}
      />
    );

  return <Outlet />;
};

export default ProtectedRoute;
