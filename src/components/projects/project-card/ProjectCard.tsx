import { JSX, useMemo } from 'react';
import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { E_USER_ENTITY_KEYS, TUser } from '../../../api/user/types';
import moment from 'moment';
import { Link } from '../../../utils/router/link';

export type TProjectCardProps = {
  poster: string;
  title: string;
  createdBy: TUser;
  createdAt: Date;
};

const ProjectCard = ({
  poster,
  title,
  createdBy,
  createdAt,
}: TProjectCardProps): JSX.Element => {
  const author = useMemo(() => {
    return (
      createdBy[E_USER_ENTITY_KEYS.USERNAME] ||
      createdBy[E_USER_ENTITY_KEYS.EMAIL]
    );
  }, [createdBy]);

  const date = useMemo(() => {
    return moment(createdAt).format('DD/MM/YYYY');
  }, [createdAt]);

  return (
    <Card
      component={Link}
      to={'/studio'}
      sx={{ width: '100%', appearance: 'auto', textDecoration: 'none' }}
      variant={'outlined'}
    >
      <CardMedia sx={{ height: 140 }} image={poster}></CardMedia>
      <CardContent
        sx={{ px: 1, py: 1, pb: (theme) => `${theme.spacing(1)} !important` }}
      >
        <Typography gutterBottom variant='h6' component='div' sx={{ m: 0 }}>
          {title}
        </Typography>
        <Stack direction='row' spacing={0.5} alignItems={'center'}>
          <Typography variant='caption'>{author}</Typography>
          <Typography variant='caption'>•</Typography>
          <Typography variant='caption'>{author}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
