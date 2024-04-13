import { JSX, useMemo } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { ProjectCard } from '../../projects/project-card/ProjectCard';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { useProjects } from '../../../hooks/projects/useProjectQuery';
import { E_PROJECT_ENTITY_KEYS } from '../../../api/projects/types';

const DashboardProjects = (): JSX.Element => {
  const { onOpen: openCreateProjectModal } = useModal(E_MODALS.CREATE_PROJECT);

  const { data, refetch, isLoading, isPending, isRefetching } = useProjects();

  const isInProgress = useMemo(
    () => isLoading || isPending || isRefetching,
    [isLoading, isPending, isRefetching],
  );

  const handleCreateProjectClick = () => {
    openCreateProjectModal({});
  };

  return (
    <Stack gap={2}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Projects</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant={'contained'}
            size={'small'}
            disableElevation
            onClick={handleCreateProjectClick}
          >
            Create
          </Button>
          <Button
            variant={'contained'}
            size={'small'}
            disableElevation
            onClick={async () => refetch()}
          >
            REFETCH
          </Button>
        </Stack>
      </Stack>
      {isInProgress ? (
        <Stack
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <CircularProgress />
          <Typography variant={'h6'} align={'center'}>
            Projects are loading
          </Typography>
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {data?.map((project) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              key={project[E_PROJECT_ENTITY_KEYS.ID]}
            >
              <ProjectCard project={project} refetch={refetch} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default DashboardProjects;
