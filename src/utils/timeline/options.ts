import {
  Timeline,
  TimelineFormatLabelsOption,
  TimelineOptions,
} from 'vis-timeline';
import moment from 'moment/moment';

export const timelineCurrentTimeName = 'currentTime';

export const timelineLabelsFormat: Record<
  keyof TimelineFormatLabelsOption,
  string
> = {
  millisecond: 'mm:ss.SSS',
  second: 'mm:ss',
  minute: 'HH:mm',
  hour: 'HH:mm',
  weekday: 'HH:mm',
  day: 'HH:mm',
  week: 'HH:mm',
  month: 'HH:mm',
  year: 'HH:mm',
};

export const timelineOptions: TimelineOptions = {
  align: 'auto',
  height: '100%',
  min: new Date(0),
  zoomMin: 1000,
  showCurrentTime: false,
  showMajorLabels: false,
  groupHeightMode: 'auto',
  selectable: false,
  orientation: 'top',
  horizontalScroll: true,
  verticalScroll: true,
  zoomKey: 'ctrlKey',
  snap: null,
  stack: false,
  format: {
    minorLabels: timelineLabelsFormat,
  },
};

export const timelineMinorLabelsFormat =
  (fps: number) =>
  (date: Date, scale: string): string => {
    const momentTime = moment(date);

    if (scale !== 'millisecond')
      return momentTime.format(
        timelineLabelsFormat[scale as keyof TimelineFormatLabelsOption],
      );

    const frequency = 1000 / fps;
    const timeFromStart = momentTime.diff(moment(new Date(0)), 'milliseconds');

    const frameNumber = Math.floor(timeFromStart / frequency);

    return `${frameNumber}`;
  };

export const timelineAfterInit = (timeline: Timeline) => {
  timeline.addCustomTime(new Date(0), timelineCurrentTimeName);

  for (let i = 0; i < 12; i++)
    timeline.zoomIn(1, {
      animation: false,
    });

  timeline.moveTo(new Date(0), {
    animation: false,
  });
};
