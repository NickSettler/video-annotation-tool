import { JSX } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import {
  FastForward,
  FastRewind,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';

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
    <ButtonGroup size={'small'} variant={'outlined'}>
      <Button onClick={onFirstStep}>
        <FastRewind />
      </Button>
      <Button onClick={onPrevStep}>
        <SkipPrevious />
      </Button>
      <Button onClick={onPlayPause}>
        {isPlaying ? <PlayArrow /> : <Pause />}
      </Button>
      <Button onClick={onNextStep}>
        <SkipNext />
      </Button>
      <Button onClick={onLastStep}>
        <FastForward />
      </Button>
    </ButtonGroup>
  );
};
