import { JSX, useEffect, useMemo, useState } from 'react';
import { E_VIDEO_ENTITY_KEYS, TVideo } from '../../../../api/video/types';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Image } from 'mui-image';
import { VideoService } from '../../../../api/video/video.service';
import moment from 'moment';

export type TVideoRowItemProps = {
  video: TVideo;
};

const VideoRowItemImage = styled(Image)({
  aspectRatio: '16 / 9',

  '& > img': {
    objectFit: 'cover',
  },
});

const VideoRowItemImagePlaceholder = styled(Skeleton)({
  width: '15%',
  height: '100%',
  aspectRatio: '16 / 9',
});

const VideoRowItem = ({ video }: TVideoRowItemProps): JSX.Element => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const createdTimestamp = useMemo(
    () => moment(video[E_VIDEO_ENTITY_KEYS.CREATED_AT]).fromNow(),
    [video],
  );

  useEffect(() => {
    VideoService.getVideoPoster(video).then(setImageSrc);
  }, []);

  return (
    <Stack direction={'row'} spacing={2}>
      {imageSrc ? (
        <VideoRowItemImage src={imageSrc} width={'15%'} />
      ) : (
        <VideoRowItemImagePlaceholder variant={'rectangular'} />
      )}
      <Stack spacing={1}>
        <Typography variant={'h6'}>
          {video[E_VIDEO_ENTITY_KEYS.NAME]}
        </Typography>
        <Stack direction={'row'} spacing={1}>
          <Typography variant={'caption'}>
            Created: {createdTimestamp}
          </Typography>
        </Stack>
      </Stack>
      <Box flexGrow={1} />
      <Stack direction={'row'} spacing={1} alignItems={'start'}>
        <Button variant={'text'} size={'small'} disableElevation>
          Edit
        </Button>
        <Button
          variant={'text'}
          color={'error'}
          size={'small'}
          disableElevation
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default VideoRowItem;
