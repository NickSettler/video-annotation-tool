import { TAppState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

const videoSelector = (state: TAppState) => state.video;

export const videoUrlSelector = createSelector(
  videoSelector,
  (video) => video.url,
);

export const videoFPSSelector = createSelector(
  videoSelector,
  (video) => video.fps,
);

export const videoFrequencySelector = createSelector(videoFPSSelector, (fps) =>
  fps ? 1 / fps : 1,
);

export const videoWidthSelector = createSelector(
  videoSelector,
  (video) => video.videoWidth,
);

export const videoHeightSelector = createSelector(
  videoSelector,
  (video) => video.videoHeight,
);

export const videoCurrentTimeSelector = createSelector(
  videoSelector,
  (video) => video.currentTime,
);

export const videoCurrentFrameSelector = createSelector(
  videoCurrentTimeSelector,
  videoFrequencySelector,
  (currentTime, frequency) => Math.round(currentTime / frequency),
);

export const videoIsPlayingSelector = createSelector(
  videoSelector,
  (video) => video.isPlaying,
);

export const videoIsLoadingSelector = createSelector(
  videoSelector,
  (video) => video.isLoading,
);

export const videoIsLoadedSelector = createSelector(
  videoSelector,
  (video) => video.isLoaded,
);
