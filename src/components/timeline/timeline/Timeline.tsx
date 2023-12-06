import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../store/store';
import {
  selectAnnotationsById,
  selectAnnotationsGrouped,
  selectAnnotationsUngrouped,
} from '../../../store/annotation';
import {
  DataGroupCollectionType,
  DataItem,
  Timeline as VISTimeline,
} from 'vis-timeline';
import { Box, styled } from '@mui/material';
import { DataSet } from 'vis-data';
import {
  videoCurrentTimeSelector,
  videoDurationSelector,
  videoFPSSelector,
} from '../../../store/video';
import {
  timelineAfterInit,
  timelineCurrentTimeName,
  timelineOptions,
} from '../../../utils/timeline/options';
import { useTimelineHandlers } from '../../../hooks/timeline/useTimelineHandlers';
import { entries, flattenDepth, map, maxBy, minBy, reduce } from 'lodash';

const TimelineStyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,

  '& > .container > .vis-timeline': {
    border: 0,
    borderTop: `1px solid ${theme.palette.divider}`,

    '& .vis-time-axis .vis-grid.vis-minor': {
      borderColor: theme.palette.divider,
    },

    '& > .vis-panel.vis-left': {
      '& > .vis-shadow.vis-top': {},
    },

    '& .vis-panel.vis-bottom, .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top':
      {
        borderColor: theme.palette.divider,
      },
  },
}));

export const Timeline = (): JSX.Element => {
  const videoFPS = useAppSelector(videoFPSSelector);
  const videoCurrentTime = useAppSelector(videoCurrentTimeSelector);
  const videoDuration = useAppSelector(videoDurationSelector);
  const videoAnnotationsByID = useAppSelector(selectAnnotationsById);
  const groupedAnnotations = useAppSelector(selectAnnotationsGrouped);
  const ungroupedAnnotations = useAppSelector(selectAnnotationsUngrouped);

  const containerRef = useRef<HTMLDivElement>(null);

  const [timeline, setTimeline] = useState<VISTimeline | null>(null);

  const timelineGroups = useMemo((): DataGroupCollectionType => {
    return videoAnnotationsByID.map((annotation) => ({
      id: annotation.id,
      content: annotation.properties.name ?? annotation.id.split('-')[0],
    }));
  }, [videoAnnotationsByID]);

  const timelineItems = useMemo(() => {
    if (!videoFPS) return [];

    const rangeItems: Array<DataItem> = flattenDepth(
      map(entries(groupedAnnotations), ([id, annotations]) => {
        const minFrame = minBy(
          annotations,
          (annotation) => annotation.properties.frame,
        );
        const maxFrame = maxBy(
          annotations,
          (annotation) => annotation.properties.frame,
        );

        if (!minFrame || !maxFrame) return [];

        return reduce(
          annotations,
          (acc, annotation, index) => {
            if (index === 0) {
              acc.push({
                id: `${annotation.id}`,
                group: id,
                style: `--color: ${annotation.properties.color}`,
                type: 'point',
                content:
                  annotation.properties.name ?? annotation.id.split('-')[0],
                start: new Date((minFrame.properties.frame * 1000) / videoFPS),
              });
              return acc;
            }

            const prevAnnotation = annotations[index - 1];

            if (
              prevAnnotation.properties.frame + 1 !==
              annotation.properties.frame
            ) {
              acc.push({
                id: `${annotation.id}_${annotation.properties.frame}`,
                group: id,
                style: `--color: ${annotation.properties.color}`,
                type: 'point',
                content:
                  annotation.properties.name ?? annotation.id.split('-')[0],
                start: new Date(
                  (annotation.properties.frame * 1000) / videoFPS,
                ),
              });
            } else {
              acc[acc.length - 1] = {
                ...acc[acc.length - 1],
                id: `${acc[acc.length - 1].id}_${annotation.properties.frame}`,
                end: new Date((annotation.properties.frame * 1000) / videoFPS),
                type: 'range',
              };
            }

            return acc;
          },
          [] as Array<DataItem>,
        );
      }),
      1,
    );

    const pointItems = map(ungroupedAnnotations, (annotation) => ({
      id: `${annotation.id}`,
      group: `${annotation.id}`,
      style: `--color: ${annotation.properties.color}`,
      content: annotation.properties.name ?? annotation.id.split('-')[0],
      start: new Date((annotation.properties.frame * 1000) / videoFPS),
      type: 'point',
    }));

    return new DataSet([...rangeItems, ...pointItems]);
  }, [groupedAnnotations, ungroupedAnnotations, videoFPS]);

  const timelineHandlers = useTimelineHandlers(timeline);

  useEffect(() => {
    if (!timeline && containerRef.current) {
      const _timeline: VISTimeline = new VISTimeline(
        containerRef.current,
        [],
        [],
        timelineOptions,
      );

      timelineAfterInit(_timeline);

      setTimeline(_timeline);
    }
  }, [timeline]);

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
    if (window.end.getTime() - time.getTime() < 1000) {
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
    if (!timeline) return;

    timeline.setGroups(timelineGroups);
  }, [timeline, timelineGroups]);

  return (
    <TimelineStyledBox flexGrow={1}>
      <div
        style={{ height: '100%' }}
        ref={containerRef}
        className='container'
      ></div>
    </TimelineStyledBox>
  );
};
