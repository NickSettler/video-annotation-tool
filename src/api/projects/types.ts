import { TUser } from '../user/types';
import { TVideo } from '../video/types';
import { TAnnotation } from '../../store/annotation';

export enum E_PROJECT_ENTITY_KEYS {
  ID = 'id',
  NAME = 'name',
  VIDEO_ID = 'video_id',
  VIDEO = 'video',
  ANNOTATIONS = 'annotations',
  CREATED_BY = 'created_by',
  CREATED_AT = 'created_at',
}

export type TProject = {
  [E_PROJECT_ENTITY_KEYS.ID]: string;
  [E_PROJECT_ENTITY_KEYS.NAME]: string;
  [E_PROJECT_ENTITY_KEYS.VIDEO_ID]: string;
  [E_PROJECT_ENTITY_KEYS.VIDEO]: TVideo;
  [E_PROJECT_ENTITY_KEYS.ANNOTATIONS]: Array<Array<TAnnotation>> | null;
  [E_PROJECT_ENTITY_KEYS.CREATED_BY]: TUser;
  [E_PROJECT_ENTITY_KEYS.CREATED_AT]: Date;
};
