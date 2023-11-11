import { JSX } from 'react';
import { Box, CircularProgress, styled, Typography } from '@mui/material';

export const OverlayContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  borderRadius: theme.spacing(2),
  border: `1px dashed ${theme.palette.divider}`,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
}));

export type TVideoOverlayProps = {
  isLoading: boolean;
};

export const VideoOverlay = ({
  isLoading = false,
}: TVideoOverlayProps): JSX.Element => {
  return (
    <OverlayContainer
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {!isLoading && (
        <Typography variant={'body2'} color={'gray'}>
          Set a video URL to start playing
        </Typography>
      )}
      {isLoading && <CircularProgress />}
    </OverlayContainer>
  );
};
