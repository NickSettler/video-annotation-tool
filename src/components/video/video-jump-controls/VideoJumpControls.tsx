import React, { JSX } from 'react';
import { Box } from '@mui/material';
import {
  VideoButtonGroup,
  VideoControlButton,
} from '../video-controls/VideoControls';
import { Eject } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectNextUngroupedAnnotation,
  selectPreviousUngroupedAnnotation,
} from '../../../store/annotation';
import {
  setVideoCurrentFrameAction,
  videoIsLoadedSelector,
} from '../../../store/video';

export const VideoJumpControls = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const previousAnnotationFrame = useAppSelector(
    selectPreviousUngroupedAnnotation,
  );
  const nextAnnotationFrame = useAppSelector(selectNextUngroupedAnnotation);

  const handlePreviousFrameClick = () => {
    if (!previousAnnotationFrame) return;

    dispatch(
      setVideoCurrentFrameAction(previousAnnotationFrame.properties.frame),
    );
  };

  const handleNextFrameClick = () => {
    if (!nextAnnotationFrame) return;

    dispatch(setVideoCurrentFrameAction(nextAnnotationFrame.properties.frame));
  };

  return (
    <Box justifyContent={'end'}>
      <VideoButtonGroup size={'small'} variant={'text'} disabled={!isLoaded}>
        <VideoControlButton onClick={handlePreviousFrameClick}>
          <Eject sx={{ transform: 'rotate(-90deg)' }} />
        </VideoControlButton>
        <VideoControlButton onClick={handleNextFrameClick}>
          <Eject sx={{ transform: 'rotate(90deg)' }} />
        </VideoControlButton>
      </VideoButtonGroup>
    </Box>
  );
};
