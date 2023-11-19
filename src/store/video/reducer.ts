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
  setVideoUrlAction,
  setVideoViewportSizeAction,
} from './actions';

const initialState: TVideoState = {
  url: null,
  fps: null,
  videoWidth: null,
  videoHeight: null,
  viewportWidth: null,
  videoDuration: null,
  viewportHeight: null,
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
