import { Navigate, RouteObject } from 'react-router-dom';
import { LoginPage } from '../../views/auth/login';
import App from '../../App';
import { AuthRootPage } from '../../views/auth/auth-root';
import { StudioPage } from '../../views/studio';
import { NotFoundPage } from '../../views/error/404';
import { ProtectedRoute } from './protected-route';
import { PublicOnlyRoute } from './public-only-route';
import { RegisterPage } from '../../views/auth/register';

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
