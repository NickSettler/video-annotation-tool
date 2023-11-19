import { JSX } from 'react';
import { Box, Drawer, Toolbar, Typography } from '@mui/material';
import { AnnotationList } from '../../annotation/annotation-list/AnnotationList';

const drawerWidth = '40%';

export const AppDrawer = (): JSX.Element => {
  return (
    <Drawer
      variant='permanent'
      anchor={'right'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <Typography sx={{ px: 2, mb: 2 }} variant={'h6'}>
          Annotations
        </Typography>
        <AnnotationList />
      </Box>
    </Drawer>
  );
};
