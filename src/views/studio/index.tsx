import React, { JSX } from 'react';
import { AppToolbar } from '../../components/common/app-toolbar/AppToolbar';
import { Stack, Toolbar } from '@mui/material';
import { VideoBlock } from '../../components/video/studio/video-block/VideoBlock';
import { Timeline } from '../../components/timeline/timeline/Timeline';
import { AppDrawer } from '../../components/common/app-drawer/AppDrawer';

const StudioPage = (): JSX.Element => {
  return (
    <>
      <AppToolbar />
      <Stack component='main' sx={{ width: '100%', height: '100vh' }}>
        <Toolbar />
        <Stack sx={{ height: '100%' }}>
          <VideoBlock />
          <Timeline />
        </Stack>
      </Stack>
      <AppDrawer />
    </>
  );
};

export default StudioPage;
