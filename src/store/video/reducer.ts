import { TVideoState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  setVideoCurrentTimeAction,
  setVideoLoadedAction,
  setVideoLoadingAction,
  setVideoMetadataAction,
  setVideoPlayingAction,
  setVideoUrlAction,
  setVideoViewportSizeAction,
} from './actions';

const initialState: TVideoState = {
  url: null,
  fps: null,
  videoWidth: null,
  videoHeight: null,
  viewportWidth: null,
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
    .addCase(setVideoMetadataAction, (state, { payload }) => ({
      ...state,
      ...(payload === null
        ? {
            fps: null,
            videoWidth: null,
            videoHeight: null,
          }
        : {
            ...(payload.fps && { fps: payload.fps }),
            ...(payload.width && { videoWidth: payload.width }),
            ...(payload.height && { videoHeight: payload.height }),
          }),
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
