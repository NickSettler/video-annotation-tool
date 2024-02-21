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

export const videoDurationSelector = createSelector(
  videoState,
  (video) => video.videoDuration,
);

export const videoTotalFramesSelector = createSelector(
  videoDurationSelector,
  videoFrequencySelector,
  (duration, frequency) => (duration ? Math.round(duration / frequency) : 0),
);

export const videoZoomSelector = createSelector(
  videoState,
  (video) => video.zoom,
);

export const videoTranslateXSelector = createSelector(
  videoState,
  (video) => video.translateX,
);

export const videoTranslateYSelector = createSelector(
  videoState,
  (video) => video.translateY,
);

export const videoViewportWidthSelector = createSelector(
  videoState,
  (video) => video.viewportWidth,
);

export const videoViewportHeightSelector = createSelector(
  videoState,
  (video) => video.viewportHeight,
);

export const videoZoomedViewportWidthSelector = createSelector(
  videoViewportWidthSelector,
  videoZoomSelector,
  (viewportWidth, zoom) => zoom * (viewportWidth ?? 1),
);

export const videoZoomedViewportHeightSelector = createSelector(
  videoViewportHeightSelector,
  videoZoomSelector,
  (viewportHeight, zoom) => zoom * (viewportHeight ?? 1),
);

export const videoWidthRatioSelector = createSelector(
  videoWidthSelector,
  videoViewportWidthSelector,
  (width, viewportWidth) =>
    width && viewportWidth ? width / viewportWidth : 1,
);

export const videoHeightRatioSelector = createSelector(
  videoHeightSelector,
  videoViewportHeightSelector,
  (height, viewportHeight) =>
    height && viewportHeight ? height / viewportHeight : 1,
);

export const videoWidthRatioZoomedSelector = createSelector(
  videoWidthSelector,
  videoZoomedViewportWidthSelector,
  (width, viewportWidth) =>
    width && viewportWidth ? width / viewportWidth : 1,
);

export const videoHeightRatioZoomedSelector = createSelector(
  videoHeightSelector,
  videoZoomedViewportHeightSelector,
  (height, viewportHeight) =>
    height && viewportHeight ? height / viewportHeight : 1,
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
