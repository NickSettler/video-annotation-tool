import { createAction } from '@reduxjs/toolkit';
import { TVideoMeta } from './types';

export const moduleName = 'video';

export enum E_VIDEO_ACTIONS {
  SET_VIDEO_URL = `${moduleName}/SET_VIDEO_URL`,
  SET_VIDEO_METADATA = `${moduleName}/SET_VIDEO_METADATA`,
  SET_VIDEO_VIEWPORT_SIZE = `${moduleName}/SET_VIDEO_VIEWPORT_SIZE`,

  SET_VIDEO_CURRENT_TIME = `${moduleName}/SET_VIDEO_CURRENT_TIME`,
  SET_VIDEO_PLAYING = `${moduleName}/SET_VIDEO_PLAYING`,
  SET_VIDEO_LOADING = `${moduleName}/SET_VIDEO_LOADING`,
  SET_VIDEO_LOADED = `${moduleName}/SET_VIDEO_LOADED`,
}

export const setVideoUrlAction = createAction<string>(
  E_VIDEO_ACTIONS.SET_VIDEO_URL,
);

export const setVideoMetadataAction = createAction<Partial<TVideoMeta> | null>(
  E_VIDEO_ACTIONS.SET_VIDEO_METADATA,
);

export const setVideoViewportSizeAction = createAction<Omit<TVideoMeta, 'fps'>>(
  E_VIDEO_ACTIONS.SET_VIDEO_VIEWPORT_SIZE,
);

export const setVideoCurrentTimeAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_CURRENT_TIME,
);

export const setVideoPlayingAction = createAction<boolean>(
  E_VIDEO_ACTIONS.SET_VIDEO_PLAYING,
);

export const setVideoLoadingAction = createAction<boolean>(
  E_VIDEO_ACTIONS.SET_VIDEO_LOADING,
);

export const setVideoLoadedAction = createAction<boolean>(
  E_VIDEO_ACTIONS.SET_VIDEO_LOADED,
);
