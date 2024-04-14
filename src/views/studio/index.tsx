import React, { JSX, useEffect, useMemo } from 'react';
import { AppToolbar } from '../../components/common/app-toolbar/AppToolbar';
import { Stack, Toolbar } from '@mui/material';
import { VideoBlock } from '../../components/video/studio/video-block/VideoBlock';
import { Timeline } from '../../components/timeline/timeline/Timeline';
import { AppDrawer } from '../../components/common/app-drawer/AppDrawer';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../../hooks/projects/useProject';
import { routesPaths } from '../../utils/router';
import Api from '../../api/base/api';
import { E_VIDEO_ENTITY_KEYS } from '../../api/video/types';
import { E_PROJECT_ENTITY_KEYS } from '../../api/projects/types';
import { useAppDispatch } from '../../store/store';
import { resetVideoStateAction, setVideoUrlAction } from '../../store/video';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import { resetStudioState, setStudioProject } from '../../store/studio';
import { useAnnotationCloudSave } from '../../hooks/annotations/useAnnotationCloudSave';
import {
  populateFromBackend,
  resetAnnotationsState,
} from '../../store/annotation';

const StudioPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { projectID } = useParams();

  if (!projectID) navigate(`${routesPaths.root}`);

  const { data, isPending, isLoading, isRefetching } = useProject(projectID!);

  const isInProcess = useMemo(
    () => isPending || isLoading || isRefetching,
    [isPending, isLoading, isRefetching],
  );

  useEffect(
    () => () => {
      dispatch(resetAnnotationsState());
      dispatch(resetStudioState());
      dispatch(resetVideoStateAction());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!data && !isInProcess) navigate(`${routesPaths.root}`);

    if (data) {
      const accessToken = LocalStorage.getItem(
        E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
      );
      // eslint-disable-next-line max-len
      const videoURL = `${Api.apiUrl}/videos/${data[E_PROJECT_ENTITY_KEYS.VIDEO][E_VIDEO_ENTITY_KEYS.ID]}/file?token=${accessToken}`;

      dispatch(setVideoUrlAction(videoURL));
      dispatch(setStudioProject(data));

      if (data[E_PROJECT_ENTITY_KEYS.ANNOTATIONS]) {
        dispatch(populateFromBackend(data[E_PROJECT_ENTITY_KEYS.ANNOTATIONS]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInProcess, navigate, dispatch]);

  useAnnotationCloudSave();

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
