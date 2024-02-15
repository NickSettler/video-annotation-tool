import React, { JSX } from 'react';
import { Box, Button, ButtonGroup, styled } from '@mui/material';
import {
  FastForward,
  FastRewind,
  MoveUp,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import { useModal } from '../../../../hooks/modal/useModal';
import { E_MODALS } from '../../../../store/modals';
import { useAppSelector } from '../../../../store/store';
import { videoIsLoadedSelector } from '../../../../store/video';

export const VideoButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,

  '& > .MuiButton-root': {
    borderColor: theme.palette.divider,
  },
}));

export const VideoControlButton = styled(Button)(({ theme }) => ({
  '&': {
    height: theme.spacing(4),
    padding: theme.spacing(0.5),
    minWidth: '0 !important',
  },

  '&.Mui-disabled': {
    borderColor: theme.palette.divider,

    '&.MuiButtonGroup-middleButton, &.MuiButtonGroup-firstButton': {
      borderRightColor: theme.palette.divider,
    },
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
  onFrameJump(frame: number): void;
};

export const VideoControls = ({
  isPlaying,
  onFirstStep,
  onPrevStep,
  onPlayPause,
  onNextStep,
  onLastStep,
  onFrameJump,
}: TVideoControlsProps): JSX.Element => {
  const { onOpen: openFrameJumpModal } = useModal(E_MODALS.JUMP_TO_FRAME);

  const isLoaded = useAppSelector(videoIsLoadedSelector);

  const handleFrameJumpClick = () => {
    openFrameJumpModal({
      onSuccess: onFrameJump,
    });
  };

  return (
    <Box justifyContent={'center'}>
      <VideoButtonGroup size={'small'} variant={'text'} disabled={!isLoaded}>
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
        <VideoControlButton disabled />
        <VideoControlButton onClick={handleFrameJumpClick}>
          <MoveUp sx={{ transform: 'rotate(90deg)' }} />
        </VideoControlButton>
      </VideoButtonGroup>
    </Box>
  );
};
