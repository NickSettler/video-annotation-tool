import { JSX } from 'react';
import { Box, Drawer, Toolbar } from '@mui/material';

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
      <Box sx={{ overflow: 'auto' }}>Hello!</Box>
    </Drawer>
  );
};
