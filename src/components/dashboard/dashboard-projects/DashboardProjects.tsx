import { JSX } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import ProjectCard from '../../projects/project-card/ProjectCard';
import Logo from '../../../../public/logo512.png';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';

const DashboardProjects = (): JSX.Element => {
  return (
    <Stack gap={2}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Typography variant={'h5'}>Projects</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button variant={'contained'} size={'small'} disableElevation>
            Create
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <ProjectCard
            poster={Logo}
            title={'Test project'}
            createdBy={{
              [E_USER_ENTITY_KEYS.ID]: 'asd',
              [E_USER_ENTITY_KEYS.EMAIL]: 'sd@settler.tech',
              [E_USER_ENTITY_KEYS.USERNAME]: 'sd',
              [E_USER_ENTITY_KEYS.PASSWORD]: 'sd',
            }}
            createdAt={new Date()}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardProjects;
