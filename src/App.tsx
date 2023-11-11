import React, { JSX } from 'react';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Grid } from '@mui/material';
import { VideoBlock } from './components/video-block/VideoBlock';

const App = (): JSX.Element => (
  <Grid container sx={{ px: 2, py: 1 }}>
    <Grid item xs={8}>
      <VideoBlock />
    </Grid>
  </Grid>
);

export default App;
