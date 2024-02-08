import { JSX } from 'react';
import { Box, CircularProgress } from '@mui/material';

const SpinnerFullScreen = (): JSX.Element => {
  return (
    <Box
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default SpinnerFullScreen;
