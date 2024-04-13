import { TUser } from '../user/types';
import { TProject } from '../projects/types';

export enum E_POSTER_ENTITY_KEYS {
  ID = 'id',
  VIDEO_ID = 'video_id',
  VIDEO = 'video',
  ORDER = 'order',
  FILENAME = 'filename',
}

export enum E_VIDEO_ENTITY_KEYS {
  ID = 'id',
  NAME = 'name',
  FILENAME = 'filename',
  POSTER_ID = 'poster_id',
  POSTER = 'poster',
  WIDTH = 'width',
  HEIGHT = 'height',
  FPS = 'fps',
  BITRATE = 'bitrate',
  CODEC = 'codec',
  ASPECT_X = 'aspect_x',
  ASPECT_Y = 'aspect_y',
  POSTERS = 'posters',
  PROJECTS = 'projects',
  CREATED_BY = 'created_by',
  CREATED_AT = 'created_at',
}

export type TPoster = {
  [E_POSTER_ENTITY_KEYS.ID]: string;
  [E_POSTER_ENTITY_KEYS.VIDEO_ID]: string;
  [E_POSTER_ENTITY_KEYS.VIDEO]: string;
  [E_POSTER_ENTITY_KEYS.ORDER]: number;
  [E_POSTER_ENTITY_KEYS.FILENAME]: string;
};

export type TVideo = {
  [E_VIDEO_ENTITY_KEYS.ID]: string;
  [E_VIDEO_ENTITY_KEYS.NAME]: string;
  [E_VIDEO_ENTITY_KEYS.FILENAME]: string;
  [E_VIDEO_ENTITY_KEYS.POSTER_ID]: string | null;
  [E_VIDEO_ENTITY_KEYS.POSTER]: TPoster | null;
  [E_VIDEO_ENTITY_KEYS.WIDTH]: number | null;
  [E_VIDEO_ENTITY_KEYS.HEIGHT]: number | null;
  [E_VIDEO_ENTITY_KEYS.FPS]: number | null;
  [E_VIDEO_ENTITY_KEYS.BITRATE]: number | null;
  [E_VIDEO_ENTITY_KEYS.CODEC]: string | null;
  [E_VIDEO_ENTITY_KEYS.ASPECT_X]: number | null;
  [E_VIDEO_ENTITY_KEYS.ASPECT_Y]: number | null;
  [E_VIDEO_ENTITY_KEYS.POSTERS]: Array<TPoster>;
  [E_VIDEO_ENTITY_KEYS.PROJECTS]: Array<TProject>;
  [E_VIDEO_ENTITY_KEYS.CREATED_BY]: TUser;
  [E_VIDEO_ENTITY_KEYS.CREATED_AT]: Date;
};
