import React, { JSX } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import { useAuth } from '../../../hooks/auth/useAuth';

export const DashboardBar = (): JSX.Element => {
  const { logout } = useAuth();

  return (
    <AppBar
      component='nav'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant='h6'>Video Annotation Tool</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction={'row'} spacing={1}>
          <IconButton color={'inherit'}>
            <Person />
          </IconButton>
          <IconButton color={'inherit'} onClick={logout}>
            <Logout />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
