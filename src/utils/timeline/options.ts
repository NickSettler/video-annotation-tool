import { Timeline, TimelineOptions } from 'vis-timeline';

export const timelineCurrentTimeName = 'currentTime';

export const timelineOptions: TimelineOptions = {
  align: 'auto',
  height: '100%',
  min: new Date(0),
  zoomMin: 1000,
  showCurrentTime: false,
  showMajorLabels: false,
  selectable: false,
  orientation: 'top',
  horizontalScroll: true,
  zoomKey: 'ctrlKey',
  snap: null,
  stack: false,
  format: {
    minorLabels: {
      millisecond: 'mm:ss.SSS',
      second: 'mm:ss',
      minute: 'HH:mm',
      hour: 'HH:mm',
      weekday: 'HH:mm',
      day: 'HH:mm',
      week: 'HH:mm',
      month: 'HH:mm',
      year: 'HH:mm',
    },
  },
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
