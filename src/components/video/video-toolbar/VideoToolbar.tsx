import { JSX } from 'react';
import { Stack, styled } from '@mui/material';
import { VideoTimestamp } from '../video-timestamp/VideoTimestamp';
import {
  TVideoControlsProps,
  VideoControls,
} from '../video-controls/VideoControls';

export type TVideoToolbarProps = TVideoControlsProps;

const VideoToolbarStyled = styled(Stack)({
  '& > *': {
    width: 'calc(100% / 3)',
    display: 'flex',
  },
});

export const VideoToolbar = (props: TVideoToolbarProps): JSX.Element => {
  return (
    <VideoToolbarStyled direction={'row'} alignItems={'center'}>
      <VideoTimestamp />
      <VideoControls {...props} />
      <div />
    </VideoToolbarStyled>
  );
};
