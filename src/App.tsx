import React, { JSX } from 'react';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Box, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation, useRoutes } from 'react-router-dom';
import { routes } from './utils/router';

const App = (): JSX.Element => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Outlet />
      <Toaster position='bottom-right' reverseOrder={false} />
    </Box>
  );
};

export default App;
