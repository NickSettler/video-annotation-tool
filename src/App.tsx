import React, { JSX } from 'react';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Box, CssBaseline, Stack, Toolbar } from '@mui/material';
import { VideoBlock } from './components/video/video-block/VideoBlock';
import { AppToolbar } from './components/common/app-toolbar/AppToolbar';
import { AppDrawer } from './components/common/app-drawer/AppDrawer';
import { Toaster } from 'react-hot-toast';
import { Timeline } from './components/timeline/timeline/Timeline';

const App = (): JSX.Element => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppToolbar />
    <Stack component='main' sx={{ width: '100%', height: '100vh' }}>
      <Toolbar />
      <Stack sx={{ height: '100%' }}>
        <VideoBlock />
        <Timeline />
      </Stack>
    </Stack>
    <AppDrawer />
    <Toaster position='bottom-right' reverseOrder={false} />
  </Box>
);

export default App;
