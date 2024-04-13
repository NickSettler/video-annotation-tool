import { JSX } from 'react';
import { useVideos } from '../../../../hooks/video/useVideoQuery';
import { Stack } from '@mui/material';
import { VideoRowItem } from '../video-row-item/VideoRowItem';
import { E_VIDEO_ENTITY_KEYS } from '../../../../api/video/types';

export const VideoList = (): JSX.Element => {
  const { data, refetch } = useVideos();

  return (
    <Stack spacing={3}>
      {data
        ? data.map((video) => (
            <VideoRowItem
              key={video[E_VIDEO_ENTITY_KEYS.ID]}
              video={video}
              refetch={refetch}
            />
          ))
        : null}
    </Stack>
  );
};
