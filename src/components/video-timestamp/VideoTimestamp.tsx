import { JSX, useMemo } from 'react';
import { Typography } from '@mui/material';
import { getSMPTETimeCode } from '../../utils/video/smpte';

export type TVideoTimestampProps = {
  fps: number;
  currentFrame: number;
};

export const VideoTimestamp = ({
  fps,
  currentFrame,
}: TVideoTimestampProps): JSX.Element => {
  const SMPTE = useMemo(() => {
    if (!fps) return '00:00:00:00';

    return getSMPTETimeCode(currentFrame, fps);
  }, [fps, currentFrame]);

  return <Typography variant={'subtitle1'}>{SMPTE}</Typography>;
};
