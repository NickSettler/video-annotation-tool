import '../../assets/styles/animations.scss';

import { JSX, useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition,
  SwitchTransition,
} from 'react-transition-group';

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

export const AuthRootPage = (): JSX.Element => {
  return (
    <AuthContainer>
      <Outlet />
    </AuthContainer>
  );
};
