import React, { JSX, useMemo } from 'react';
import {
  AppBar,
  Box,
  CircularProgress,
  Fade,
  IconButton,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { CloudDone, CloudQueue, Settings, Upload } from '@mui/icons-material';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { Link } from '../../../utils/router/link';
import { routesPaths } from '../../../utils/router';
import { useAppSelector } from '../../../store/store';
import {
  studioProjectSelector,
  studioSaveInProgress,
} from '../../../store/studio';
import { E_PROJECT_ENTITY_KEYS } from '../../../api/projects/types';

const SaveIconBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& > *': {
    position: 'absolute',
    left: theme.spacing(1),
  },

  '& > .MuiBox-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& > *': {
      position: 'absolute',
    },
  },
}));

export const AppToolbar = (): JSX.Element => {
  const { onOpen: handleSettingsModalOpen } = useModal(
    E_MODALS.PROJECT_SETTINGS,
  );
  const { onOpen: handleImportModalOpen } = useModal(
    E_MODALS.IMPORT_ANNOTATIONS,
  );

  const currentProject = useAppSelector(studioProjectSelector);
  const saveInProgress = useAppSelector(studioSaveInProgress);

  const projectName = useMemo(
    () => currentProject?.[E_PROJECT_ENTITY_KEYS.NAME] ?? 'Studio',
    [currentProject],
  );

  return (
    <AppBar
      component='nav'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      elevation={0}
    >
      <Toolbar>
        <Stack spacing={0}>
          <Typography
            variant='h6'
            component={Link}
            to={routesPaths.root}
            sx={{ textDecoration: 'none' }}
            color={'inherit'}
          >
            Video Annotation Tool
          </Typography>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography variant='body2' color={'inherit'}>
              {projectName}
            </Typography>
            <SaveIconBox>
              <Fade in={saveInProgress}>
                <Tooltip title={'Save in progress'}>
                  <Box>
                    <CloudQueue fontSize={'small'} />
                    <CircularProgress
                      size={6}
                      thickness={8}
                      color={'inherit'}
                    />
                  </Box>
                </Tooltip>
              </Fade>
              <Fade in={!saveInProgress}>
                <Tooltip title={'All changes saved'}>
                  <Box>
                    <CloudDone fontSize={'small'} />
                  </Box>
                </Tooltip>
              </Fade>
            </SaveIconBox>
          </Stack>
        </Stack>
        <Stack flexGrow={1}></Stack>
        <Stack direction={'row'} spacing={1}>
          <Tooltip title={'Import'}>
            <IconButton color={'inherit'} onClick={handleImportModalOpen}>
              <Upload />
            </IconButton>
          </Tooltip>
          <IconButton color={'inherit'} onClick={handleSettingsModalOpen}>
            <Settings />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
