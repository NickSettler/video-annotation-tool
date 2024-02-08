import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import App from '../../App';

const AuthRootPage = lazy(async () => import('../../views/auth/auth-root'));
const StudioPage = lazy(async () => import('../../views/studio'));
const NotFoundPage = lazy(async () => import('../../views/error/404'));
const LoginPage = lazy(async () => import('../../views/auth/login'));
const RegisterPage = lazy(async () => import('../../views/auth/register'));
const ProtectedRoute = lazy(async () => import('./protected-route'));
const PublicOnlyRoute = lazy(async () => import('./public-only-route'));

export const routesPaths = {
  root: '/',
  studio: {
    root: '/studio',
  },
  auth: {
    root: '/auth',
    login: 'login',
    register: 'register',
  },
} as const;

export const routes: Array<RouteObject> = [
  {
    path: routesPaths.root,
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to={routesPaths.studio.root} replace />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routesPaths.studio.root,
            element: <StudioPage />,
          },
        ],
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: routesPaths.auth.root,
            element: <AuthRootPage />,
            children: [
              {
                path: routesPaths.auth.login,
                element: <LoginPage />,
              },
              {
                path: routesPaths.auth.register,
                element: <RegisterPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
