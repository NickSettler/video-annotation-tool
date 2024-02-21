import { TVideoState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  setVideoCurrentFrameAction,
  setVideoCurrentTimeAction,
  setVideoDurationAction,
  setVideoFPSAction,
  setVideoLoadedAction,
  setVideoLoadingAction,
  setVideoPlayingAction,
  setVideoSizeAction,
  setVideoTranslateXAction,
  setVideoTranslateYAction,
  setVideoUrlAction,
  setVideoViewportSizeAction,
  setVideoZoomAction,
} from './actions';

const initialState: TVideoState = {
  url: null,
  fps: null,
  videoWidth: null,
  videoHeight: null,
  viewportWidth: null,
  videoDuration: null,
  viewportHeight: null,
  zoom: 1,
  translateX: 0,
  translateY: 0,
  currentTime: 0,
  isPlaying: false,
  isLoading: false,
  isLoaded: false,
};

export const videoReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setVideoUrlAction, (state, { payload }) => ({
      ...state,
      url: payload,
    }))
    .addCase(setVideoFPSAction, (state, { payload }) => ({
      ...state,
      fps: payload,
    }))
    .addCase(setVideoSizeAction, (state, { payload }) => ({
      ...state,
      videoWidth: payload.width,
      videoHeight: payload.height,
    }))
    .addCase(setVideoDurationAction, (state, { payload }) => ({
      ...state,
      videoDuration: payload,
    }))
    .addCase(setVideoViewportSizeAction, (state, { payload }) => ({
      ...state,
      viewportWidth: payload.width,
      viewportHeight: payload.height,
    }))
    .addCase(setVideoZoomAction, (state, { payload }) => ({
      ...state,
      // 1 <= zoom <= 4
      zoom: Math.min(4, Math.max(1, payload)),
    }))
    .addCase(setVideoTranslateXAction, (state, { payload }) => ({
      ...state,
      translateX: payload,
    }))
    .addCase(setVideoTranslateYAction, (state, { payload }) => ({
      ...state,
      translateY: payload,
    }))
    .addCase(setVideoCurrentTimeAction, (state, { payload }) => ({
      ...state,
      currentTime: payload,
    }))
    .addCase(setVideoCurrentFrameAction, (state, { payload }) => ({
      ...state,
      currentTime: payload / (state.fps ?? 1),
    }))
    .addCase(setVideoPlayingAction, (state, { payload }) => ({
      ...state,
      isPlaying: payload,
    }))
    .addCase(setVideoLoadingAction, (state, { payload }) => ({
      ...state,
      isLoading: payload,
    }))
    .addCase(setVideoLoadedAction, (state, { payload }) => ({
      ...state,
      isLoaded: payload,
    }));
});
