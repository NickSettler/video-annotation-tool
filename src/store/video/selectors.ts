import { TAppState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { getAspectRatio } from '../../utils/video/aspect';
import { moduleName } from './actions';
import { TVideoState } from './types';

const videoState = (state: TAppState): TVideoState => state[moduleName];

export const videoUrlSelector = createSelector(
  videoState,
  (video) => video.url,
);

export const videoFPSSelector = createSelector(
  videoState,
  (video) => video.fps,
);

export const videoFrequencySelector = createSelector(videoFPSSelector, (fps) =>
  fps ? 1 / fps : 1,
);

export const videoWidthSelector = createSelector(
  videoState,
  (video) => video.videoWidth,
);

export const videoHeightSelector = createSelector(
  videoState,
  (video) => video.videoHeight,
);

export const videoAspectRatioSelector = createSelector(
  videoWidthSelector,
  videoHeightSelector,
  (width, height) => getAspectRatio(width, height),
);

export const videoViewportWidthSelector = createSelector(
  videoState,
  (video) => video.viewportWidth,
);

export const videoViewportHeightSelector = createSelector(
  videoState,
  (video) => video.viewportHeight,
);

export const videoCurrentTimeSelector = createSelector(
  videoState,
  (video) => video.currentTime,
);

export const videoCurrentFrameSelector = createSelector(
  videoCurrentTimeSelector,
  videoFrequencySelector,
  (currentTime, frequency) => Math.round(currentTime / frequency),
);

export const videoIsPlayingSelector = createSelector(
  videoState,
  (video) => video.isPlaying,
);

export const videoIsLoadingSelector = createSelector(
  videoState,
  (video) => video.isLoading,
);

export const videoIsLoadedSelector = createSelector(
  videoState,
  (video) => video.isLoaded,
);
