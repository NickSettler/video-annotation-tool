import { JSX } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import { VideoList } from '../../video/dashboard/video-list/VideoList';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';

const DashboardVideos = (): JSX.Element => {
  const { onOpen: openVideoUploadModal } = useModal(E_MODALS.VIDEO_UPLOAD);

  const handleUploadClick = () => {
    openVideoUploadModal({ onSuccess: console.log });
  };

  return (
    <Stack gap={2}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Videos</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant={'contained'}
            size={'small'}
            disableElevation
            startIcon={<Upload />}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
        </Stack>
      </Stack>
      <VideoList />
    </Stack>
  );
};

export default DashboardVideos;
