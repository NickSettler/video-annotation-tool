import { JSX } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import VideoList from '../../video/dashboard/video-list/VideoList';

const DashboardVideos = (): JSX.Element => {
  return (
    <Stack gap={2}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Videos</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant={'contained'}
            size={'small'}
            disableElevation
            startIcon={<Upload />}
          >
            Upload
          </Button>
        </Stack>
      </Stack>
      <VideoList />
    </Stack>
  );
};

export default DashboardVideos;
