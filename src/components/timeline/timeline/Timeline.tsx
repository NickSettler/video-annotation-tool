import { JSX, useEffect, useRef, useState } from 'react';
import { Timeline as VISTimeline } from 'vis-timeline';
import { Box, styled } from '@mui/material';
import {
  timelineAfterInit,
  timelineOptions,
} from '../../../utils/timeline/options';
import { useTimelineEffects } from '../../../hooks/timeline/useTimelineEffects';

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

    '& .vis-item.vis-dot.diamond': {
      '--size': '4px',
      width: 0,
      height: 0,
      border: 'var(--size) solid transparent',
      borderBottomColor: 'var(--color)',
      backgroundColor: 'transparent',
      borderRadius: 0,
      marginTop: 'calc(-1 * var(--size))',

      '&::after': {
        content: '""',
        left: 'calc(-1 * var(--size))',
        top: 'var(--size)',
        position: 'absolute',
        width: 0,
        height: 0,
        border: 'var(--size) solid transparent',
        borderTopColor: 'var(--color)',
      },
    },
  },
}));

export const Timeline = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [timeline, setTimeline] = useState<VISTimeline | null>(null);

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

  useTimelineEffects(timeline);

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
