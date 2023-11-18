import { JSX } from 'react';
import { Box, Button, ButtonGroup, styled } from '@mui/material';
import {
  FastForward,
  FastRewind,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';

const VideoControlButton = styled(Button)(({ theme }) => ({
  '&': {
    width: theme.spacing(4),
    height: theme.spacing(4),
    padding: theme.spacing(0.5),
    minWidth: '0 !important',
  },

  '& > svg': {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export type TVideoControlsProps = {
  isPlaying: boolean;
  onFirstStep(): void;
  onPrevStep(): void;
  onPlayPause(): void;
  onNextStep(): void;
  onLastStep(): void;
};

export const VideoControls = ({
  isPlaying,
  onFirstStep,
  onPrevStep,
  onPlayPause,
  onNextStep,
  onLastStep,
}: TVideoControlsProps): JSX.Element => {
  return (
    <Box justifyContent={'center'}>
      <ButtonGroup size={'small'} variant={'outlined'}>
        <VideoControlButton onClick={onFirstStep}>
          <FastRewind />
        </VideoControlButton>
        <VideoControlButton onClick={onPrevStep}>
          <SkipPrevious />
        </VideoControlButton>
        <VideoControlButton onClick={onPlayPause}>
          {isPlaying ? <PlayArrow /> : <Pause />}
        </VideoControlButton>
        <VideoControlButton onClick={onNextStep}>
          <SkipNext />
        </VideoControlButton>
        <VideoControlButton onClick={onLastStep}>
          <FastForward />
        </VideoControlButton>
      </ButtonGroup>
    </Box>
  );
};
