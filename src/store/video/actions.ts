import { createAction } from '@reduxjs/toolkit';
import { TVideoMeta } from './types';

export const moduleName = 'video';

export enum E_VIDEO_ACTIONS {
  SET_VIDEO_URL = `${moduleName}/SET_VIDEO_URL`,
  SET_VIDEO_FPS = `${moduleName}/SET_VIDEO_FPS`,
  SET_VIDEO_SIZE = `${moduleName}/SET_VIDEO_SIZE`,
  SET_VIDEO_DURATION = `${moduleName}/SET_VIDEO_DURATION`,
  SET_VIDEO_VIEWPORT_SIZE = `${moduleName}/SET_VIDEO_VIEWPORT_SIZE`,

  SET_VIDEO_ZOOM = `${moduleName}/SET_VIDEO_ZOOM`,
  SET_VIDEO_TRANSLATE_X = `${moduleName}/SET_VIDEO_TRANSLATE_X`,
  SET_VIDEO_TRANSLATE_Y = `${moduleName}/SET_VIDEO_TRANSLATE_Y`,

  SET_VIDEO_CURRENT_TIME = `${moduleName}/SET_VIDEO_CURRENT_TIME`,
  SET_VIDEO_CURRENT_FRAME = `${moduleName}/SET_VIDEO_CURRENT_FRAME`,

  SET_VIDEO_PLAYING = `${moduleName}/SET_VIDEO_PLAYING`,
  SET_VIDEO_LOADING = `${moduleName}/SET_VIDEO_LOADING`,
  SET_VIDEO_LOADED = `${moduleName}/SET_VIDEO_LOADED`,
}

export const setVideoUrlAction = createAction<string>(
  E_VIDEO_ACTIONS.SET_VIDEO_URL,
);

export const setVideoFPSAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_FPS,
);

export const setVideoSizeAction = createAction<Omit<TVideoMeta, 'fps'>>(
  E_VIDEO_ACTIONS.SET_VIDEO_SIZE,
);

export const setVideoDurationAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_DURATION,
);

export const setVideoViewportSizeAction = createAction<Omit<TVideoMeta, 'fps'>>(
  E_VIDEO_ACTIONS.SET_VIDEO_VIEWPORT_SIZE,
);

export const setVideoZoomAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_ZOOM,
);

export const setVideoTranslateXAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_TRANSLATE_X,
);

export const setVideoTranslateYAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_TRANSLATE_Y,
);

export const setVideoCurrentTimeAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_CURRENT_TIME,
);

export const setVideoCurrentFrameAction = createAction<number>(
  E_VIDEO_ACTIONS.SET_VIDEO_CURRENT_FRAME,
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
