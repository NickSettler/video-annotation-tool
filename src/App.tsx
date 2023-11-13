import React, { JSX } from 'react';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Box, CssBaseline, Grid, Toolbar as MUIToolbar } from '@mui/material';
import { VideoBlock } from './components/video/video-block/VideoBlock';
import { AnnotationList } from './components/annotation/annotation-list/AnnotationList';
import { Toolbar } from './components/common/toolbar/Toolbar';

const App = (): JSX.Element => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Toolbar />
    <Box component='main' sx={{ p: 3, width: '100%' }}>
      <MUIToolbar />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <VideoBlock />
        </Grid>
        <Grid item xs={4}>
          <AnnotationList />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

export default App;
