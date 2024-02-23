import React, { JSX, useMemo } from 'react';
import { DashboardBar } from '../../components/dashboard/dashboard-bar/DashboardBar';
import { Stack, Toolbar } from '@mui/material';
import { DashboardDrawer } from '../../components/dashboard/dashboard-drawer/DashboardDrawer';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isEmpty, reject } from 'lodash';
import { routesPaths } from '../../utils/router';

const Dashboard = (): JSX.Element => {
  const location = useLocation();

  const isNestedPage = useMemo(
    () => reject(location.pathname.split('/'), isEmpty).length > 1,
    [location],
  );

  if (!isNestedPage) {
    return (
      <Navigate
        to={[routesPaths.dashboard.root, routesPaths.dashboard.projects].join(
          '/',
        )}
        replace
      />
    );
  }

  return (
    <>
      <DashboardBar />
      <DashboardDrawer />
      <Stack component='main' sx={{ width: '100%', height: '100vh' }}>
        <Toolbar />
        <Stack sx={{ height: '100%', px: 3, py: 2, overflowY: 'auto' }}>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
};

export default Dashboard;
