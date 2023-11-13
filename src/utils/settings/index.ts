export enum E_VIDEO_TIMESTAMP_MODE {
  SMPTE = 'SMPTE',
  FRAME = 'FRAME',
}

export type TUserSettings = {
  timestampMode: E_VIDEO_TIMESTAMP_MODE;
};

export const defaultUserSettings: TUserSettings = {
  timestampMode: E_VIDEO_TIMESTAMP_MODE.SMPTE,
};
