import { JSX, useEffect, useMemo, useState, MouseEvent } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import moment from 'moment';
import { E_PROJECT_ENTITY_KEYS, TProject } from '../../../api/projects/types';
import { VideoService } from '../../../api/video/video.service';
import { Delete } from '@mui/icons-material';
import { useProjectMutations } from '../../../hooks/projects/useProjectMutations';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { E_MODAL_ROLE } from '../../../utils/modal/types';
import { useNavigate } from 'react-router-dom';

export type TProjectCardProps = {
  project: TProject;
  refetch(): Promise<unknown>;
};

export const ProjectCard = ({
  project,
  refetch,
}: TProjectCardProps): JSX.Element => {
  const navigate = useNavigate();

  const { onOpen: openConfirmDialog } = useModal(E_MODALS.CONFIRM_DIALOG);

  const { deleteMutation } = useProjectMutations({
    refetch,
  });

  const [posterImage, setPosterImage] = useState<string | undefined>();

  const author = useMemo(() => {
    return (
      project[E_PROJECT_ENTITY_KEYS.CREATED_BY][E_USER_ENTITY_KEYS.USERNAME] ||
      project[E_PROJECT_ENTITY_KEYS.CREATED_BY][E_USER_ENTITY_KEYS.EMAIL]
    );
  }, [project]);

  const date = useMemo(() => {
    return moment(project[E_PROJECT_ENTITY_KEYS.CREATED_AT]).format(
      'DD/MM/YYYY',
    );
  }, [project]);

  useEffect(() => {
    VideoService.getVideoPoster(project[E_PROJECT_ENTITY_KEYS.VIDEO]).then(
      setPosterImage,
    );
  }, [project]);

  const handleCardClick = () => {
    navigate(`/studio/${project[E_PROJECT_ENTITY_KEYS.ID]}`);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();

    openConfirmDialog({
      title: `Delete project ${project[E_PROJECT_ENTITY_KEYS.NAME]}`,
      description:
        'Are you sure you want to delete this project? This action cannot be undone.',
      role: E_MODAL_ROLE.DESTRUCTIVE,
      onConfirm: () => deleteMutation.mutate(project[E_PROJECT_ENTITY_KEYS.ID]),
    });
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{ width: '100%', appearance: 'auto', textDecoration: 'none' }}
      variant={'outlined'}
    >
      <CardMedia sx={{ height: 140 }} image={posterImage}></CardMedia>
      <CardContent
        sx={{ px: 1, py: 1, pb: (theme) => `${theme.spacing(1)} !important` }}
      >
        <Stack
          direction='row'
          spacing={1}
          alignItems={'start'}
          justifyContent={'space-between'}
        >
          <Stack>
            <Typography gutterBottom variant='h6' component='div' sx={{ m: 0 }}>
              {project[E_PROJECT_ENTITY_KEYS.NAME]}
            </Typography>
            <Stack direction='row' spacing={0.5} alignItems={'center'}>
              <Typography variant='caption'>{author}</Typography>
              <Typography variant='caption'>•</Typography>
              <Typography variant='caption'>{date}</Typography>
            </Stack>
          </Stack>
          <Tooltip title={'Delete project'}>
            <IconButton
              color={'error'}
              size={'small'}
              onClick={handleDeleteClick}
            >
              <Delete fontSize={'small'} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};
