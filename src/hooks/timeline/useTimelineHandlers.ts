import { useAppDispatch } from '../../store/store';
import { timelineCurrentTimeName } from '../../utils/timeline/options';
import { setVideoCurrentTimeAction } from '../../store/video';
import moment from 'moment';
import { useCallback } from 'react';
import { Timeline, TimelineEventPropertiesResult } from 'vis-timeline';

export type TUseTimelineHandlers = {
  handleTimelineTimeChanged(args: any): void;
  handleTimelineClick(args: TimelineEventPropertiesResult): void;
};

export const useTimelineHandlers = (
  timeline: Timeline | null,
): TUseTimelineHandlers => {
  const dispatch = useAppDispatch();

  const handleTimelineTimeChanged = useCallback(
    ({ id, time }: any) => {
      if (!timeline) return;

      const momentTime = moment(time);

      if (id === timelineCurrentTimeName) {
        const timeFromStart = momentTime.diff(new Date(0), 'milliseconds');
        dispatch(setVideoCurrentTimeAction(timeFromStart / 1000));
      }
    },
    [dispatch, timeline],
  );

  const handleTimelineClick = useCallback(
    (args: TimelineEventPropertiesResult) => {
      const { time, what } = args;

      if (!timeline) return;

      const momentTime = moment(time);

      if (momentTime.unix() < 0) return;

      if (what === 'axis') {
        const timeFromStart = momentTime.diff(new Date(0), 'milliseconds');
        dispatch(setVideoCurrentTimeAction(timeFromStart / 1000));
      }
    },
    [dispatch, timeline],
  );

  return {
    handleTimelineTimeChanged,
    handleTimelineClick,
  };
};
