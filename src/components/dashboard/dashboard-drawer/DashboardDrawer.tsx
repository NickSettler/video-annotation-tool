import { JSX } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { SpaceDashboard, Videocam } from '@mui/icons-material';
import { Link } from '../../../utils/router/link';
import { routesPaths } from '../../../utils/router';

const drawerWidth = '25%';

export const DashboardDrawer = (): JSX.Element => {
  return (
    <Drawer
      variant='permanent'
      anchor={'left'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <nav>
        <List disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              component={Link}
              to={[
                routesPaths.dashboard.root,
                routesPaths.dashboard.projects,
              ].join('/')}
            >
              <ListItemIcon>
                <SpaceDashboard />
              </ListItemIcon>
              <ListItemText primary={'Projects'} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              component={Link}
              to={[
                routesPaths.dashboard.root,
                routesPaths.dashboard.videos,
              ].join('/')}
            >
              <ListItemIcon>
                <Videocam />
              </ListItemIcon>
              <ListItemText primary={'Videos'} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Drawer>
  );
};
