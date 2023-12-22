import { JSX } from 'react';
import { Stack, styled, Typography } from '@mui/material';

const NotFoundContainer = styled(Stack)({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const NotFoundPage = (): JSX.Element => {
  return (
    <NotFoundContainer>
      <Typography variant={'h2'}>404</Typography>
      <Typography variant={'h3'}>Page not found</Typography>
    </NotFoundContainer>
  );
};
