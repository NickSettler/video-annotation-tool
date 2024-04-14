import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import App from '../../App';

const ProtectedRoute = lazy(async () => import('./protected-route'));
const PublicOnlyRoute = lazy(async () => import('./public-only-route'));
const NotFoundPage = lazy(async () => import('../../views/error/404'));

const AuthRootPage = lazy(async () => import('../../views/auth/auth-root'));
const LoginPage = lazy(async () => import('../../views/auth/login'));
const RegisterPage = lazy(async () => import('../../views/auth/register'));

const DashboardPage = lazy(
  async () => import('../../views/dashboard/dashboard'),
);
const DashboardProjects = lazy(
  async () =>
    import('../../components/dashboard/dashboard-projects/DashboardProjects'),
);
const DashboardVideos = lazy(
  async () =>
    import('../../components/dashboard/dashboard-videos/DashboardVideos'),
);

const StudioPage = lazy(async () => import('../../views/studio'));

export const routesPaths = {
  root: '/',
  workspace: {
    root: '/workspace',
    select: 'select',
  },
  dashboard: {
    root: '/dashboard',
    projects: 'projects',
    videos: 'videos',
  },
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
        element: <Navigate to={routesPaths.dashboard.root} replace />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routesPaths.dashboard.root,
            element: <DashboardPage />,
            children: [
              {
                path: routesPaths.dashboard.projects,
                element: <DashboardProjects />,
              },
              {
                path: routesPaths.dashboard.videos,
                element: <DashboardVideos />,
              },
            ],
          },
          {
            path: `${routesPaths.studio.root}/:projectID`,
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
