import { JSX } from 'react';
import { Stack, styled } from '@mui/material';
import { VideoTimestamp } from '../video-timestamp/VideoTimestamp';
import {
  TVideoControlsProps,
  VideoControls,
} from '../video-controls/VideoControls';
import { VideoJumpControls } from '../video-jump-controls/VideoJumpControls';

export type TVideoToolbarProps = TVideoControlsProps;

const VideoToolbarStyled = styled(Stack)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 3),

  '& > *': {
    width: 'calc(100% / 3)',
    display: 'flex',
  },
}));

export const VideoToolbar = (props: TVideoToolbarProps): JSX.Element => {
  return (
    <VideoToolbarStyled direction={'row'} alignItems={'center'}>
      <VideoTimestamp />
      <VideoControls {...props} />
      <VideoJumpControls />
    </VideoToolbarStyled>
  );
};
