import React, { JSX } from 'react';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { VideoBlock } from './components/video/video-block/VideoBlock';
import { AppToolbar } from './components/common/app-toolbar/AppToolbar';
import { AppDrawer } from './components/common/app-drawer/AppDrawer';

const App = (): JSX.Element => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppToolbar />
    <Box component='main' sx={{ p: 3, width: '100%' }}>
      <Toolbar />
      <VideoBlock />
    </Box>
    <AppDrawer />
  </Box>
);

export default App;
