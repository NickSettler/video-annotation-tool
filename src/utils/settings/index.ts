export enum E_VIDEO_TIMESTAMP_MODE {
  SMPTE = 'SMPTE',
  FRAME = 'FRAME',
}

export enum E_TIMELINE_LABELS_FORMAT {
  TIME = 'TIME',
  FRAME = 'FRAME',
}

export type TUserSettings = {
  timestampMode: E_VIDEO_TIMESTAMP_MODE;
  timelineLabelsFormat: E_TIMELINE_LABELS_FORMAT;
};

export const defaultUserSettings: TUserSettings = {
  timestampMode: E_VIDEO_TIMESTAMP_MODE.SMPTE,
  timelineLabelsFormat: E_TIMELINE_LABELS_FORMAT.TIME,
};
