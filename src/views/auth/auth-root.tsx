import '../../assets/styles/animations.scss';

import { JSX } from 'react';
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',

  '& > *': {
    marginTop: theme.spacing(12),
  },
}));

const AuthRootPage = (): JSX.Element => {
  return (
    <AuthContainer>
      <Outlet />
    </AuthContainer>
  );
};

export default AuthRootPage;
