import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import {
  defaultUserSettings,
  E_TIMELINE_LABELS_FORMAT,
  E_VIDEO_TIMESTAMP_MODE,
} from '../../utils/settings';
import { useMemo } from 'react';

export type TUseUserSettings = {
  timestampMode: E_VIDEO_TIMESTAMP_MODE;
  timelineLabelsFormat: E_TIMELINE_LABELS_FORMAT;

  setTimestampMode(mode: E_VIDEO_TIMESTAMP_MODE): void;
  setTimelineLabelsFormat(format: E_TIMELINE_LABELS_FORMAT): void;
};

export const useUserSettings = (): TUseUserSettings => {
  const [userSettings, setUserSettings] = useLocalStorage(
    E_LOCAL_STORAGE_KEYS.SETTINGS,
    defaultUserSettings,
  );

  const timestampMode = useMemo(
    () => userSettings.timestampMode,
    [userSettings],
  );

  const timelineLabelsFormat = useMemo(
    () => userSettings.timelineLabelsFormat,
    [userSettings],
  );

  const setTimestampMode = (mode: E_VIDEO_TIMESTAMP_MODE) => {
    setUserSettings((prev) => ({
      ...prev,
      timestampMode: mode,
    }));
  };

  const setTimelineLabelsFormat = (format: E_TIMELINE_LABELS_FORMAT) => {
    setUserSettings((prev) => ({
      ...prev,
      timelineLabelsFormat: format,
    }));
  };

  return {
    timestampMode,
    timelineLabelsFormat,

    setTimestampMode,
    setTimelineLabelsFormat,
  };
};
