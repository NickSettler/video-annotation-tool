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
import { useVideoMutations } from '../../../../hooks/video/useVideoMutations';
import { useModal } from '../../../../hooks/modal/useModal';
import { E_MODALS } from '../../../../store/modals';
import { E_MODAL_ROLE } from '../../../../utils/modal/types';

export type TVideoRowItemProps = {
  video: TVideo;
  isReadonly?: boolean;
  onSelect?(video: TVideo): void;
  refetch?(): Promise<unknown>;
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

export const VideoRowItem = ({
  video,
  isReadonly = false,
  onSelect,
  refetch,
}: TVideoRowItemProps): JSX.Element => {
  const { deleteMutation } = useVideoMutations({
    refetch,
  });

  const { onOpen: openConfirmDialog } = useModal(E_MODALS.CONFIRM_DIALOG);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const createdTimestamp = useMemo(
    () => moment(video[E_VIDEO_ENTITY_KEYS.CREATED_AT]).fromNow(),
    [video],
  );

  const usedProjectsCaption = useMemo(() => {
    const projects = video[E_VIDEO_ENTITY_KEYS.PROJECTS];

    if (!projects) return '';

    if (projects.length === 0) {
      return 'Not used in any projects';
    }

    return `Used in ${projects.length} project${projects.length > 1 ? 's' : ''}`;
  }, [video]);

  useEffect(() => {
    VideoService.getVideoPoster(video).then(setImageSrc);
  }, [video]);

  const handleSelectClick = () => {
    if (onSelect) onSelect(video);
  };

  const handleDeleteClick = () => {
    openConfirmDialog({
      title: `Delete video ${video[E_VIDEO_ENTITY_KEYS.NAME]}?`,
      description:
        'Are you sure you want to delete this video? This action cannot be undone.',
      role: E_MODAL_ROLE.DESTRUCTIVE,
      onConfirm: () => deleteMutation.mutate(video[E_VIDEO_ENTITY_KEYS.ID]),
    });
  };

  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'}>
      {imageSrc ? (
        <VideoRowItemImage src={imageSrc} width={'20%'} />
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
          <Typography variant={'caption'}>{usedProjectsCaption}</Typography>
        </Stack>
      </Stack>
      <Box flexGrow={1} />
      <Stack
        direction={'row'}
        spacing={1}
        alignItems={'start'}
        alignSelf={'start'}
      >
        {onSelect && (
          <Button
            variant={'text'}
            color={'primary'}
            size={'small'}
            disableElevation
            onClick={handleSelectClick}
          >
            Select
          </Button>
        )}
        {!isReadonly && (
          <Button
            variant={'text'}
            color={'error'}
            size={'small'}
            disableElevation
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
