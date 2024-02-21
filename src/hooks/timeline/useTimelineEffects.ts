import { useEffect, useMemo } from 'react';
import { Timeline as VISTimeline } from 'vis-timeline';
import { useTimelineHandlers } from './useTimelineHandlers';
import { DataSet } from 'vis-data';
import { useAppSelector } from '../../store/store';
import {
  selectTimelinePointItems,
  selectTimelineRangeItems,
  selectTimelineGroups,
} from '../../store/annotation';
import {
  timelineCurrentTimeName,
  timelineLabelsFormat,
  timelineMinorLabelsFormat,
} from '../../utils/timeline/options';
import {
  videoCurrentTimeSelector,
  videoDurationSelector,
  videoFPSSelector,
} from '../../store/video';
import { E_TIMELINE_LABELS_FORMAT } from '../../utils/settings';
import { useUserSettings } from '../settings/useUserSettings';

export const useTimelineEffects = (timeline: VISTimeline | null) => {
  const videoFPS = useAppSelector(videoFPSSelector);
  const videoCurrentTime = useAppSelector(videoCurrentTimeSelector);
  const videoDuration = useAppSelector(videoDurationSelector);
  const timelineGroups = useAppSelector(selectTimelineGroups);
  const timelineRangeItems = useAppSelector(selectTimelineRangeItems);
  const timelinePointItems = useAppSelector(selectTimelinePointItems);

  const { timelineLabelsFormat: settingsTimelineLabelsFormat } =
    useUserSettings();

  const timelineHandlers = useTimelineHandlers(timeline);

  const timelineItems = useMemo(
    () => new DataSet([...timelineRangeItems, ...timelinePointItems]),
    [timelineRangeItems, timelinePointItems],
  );

  useEffect(() => {
    if (!timeline) return;

    const { handleTimelineTimeChanged, handleTimelineClick } = timelineHandlers;

    timeline.on('timechanged', handleTimelineTimeChanged);
    timeline.on('click', handleTimelineClick);

    return () => {
      timeline.off('timechanged', handleTimelineTimeChanged);
      timeline.off('click', handleTimelineClick);
    };
  }, [timeline, timelineHandlers]);

  useEffect(() => {
    if (!timeline) return;

    timeline.setItems(timelineItems);
  }, [timeline, timelineItems]);

  useEffect(() => {
    if (!timeline || !videoFPS) return;

    const time = new Date(videoCurrentTime * 1000);
    const window = timeline.getWindow();

    timeline.setCustomTime(time, timelineCurrentTimeName);
    timeline.setCustomTimeTitle(
      `Frame: ${videoCurrentTime * videoFPS}`,
      timelineCurrentTimeName,
    );
    if (
      window.end.getTime() - time.getTime() < 1000 ||
      window.start.getTime() - time.getTime() > 1000
    ) {
      timeline.moveTo(time, {
        animation: false,
      });
    }
  }, [timeline, videoCurrentTime, videoFPS]);

  useEffect(() => {
    if (!timeline || !videoDuration) return;

    timeline.setOptions({
      max: new Date(videoDuration * 1000),
    });
  }, [timeline, videoDuration]);

  useEffect(() => {
    if (!timeline || !videoFPS) return;

    timeline.setOptions({
      format: {
        minorLabels:
          settingsTimelineLabelsFormat === E_TIMELINE_LABELS_FORMAT.TIME
            ? timelineLabelsFormat
            : timelineMinorLabelsFormat(videoFPS),
      },
    });
  }, [timeline, timelineItems, settingsTimelineLabelsFormat, videoFPS]);

  useEffect(() => {
    if (!timeline) return;

    timeline.setGroups(timelineGroups);
  }, [timeline, timelineGroups]);
};
