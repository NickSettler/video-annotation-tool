import { FormEvent, JSX, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import { useAuthMutations } from '../../hooks/auth/useAuthMutations';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';
import { Link } from '../../utils/router/link';
import { routesPaths } from '../../utils/router';

export const LoginPage = (): JSX.Element => {
  const { loginMutation } = useAuthMutations();

  const [data, setData] = useState({
    [E_USER_ENTITY_KEYS.USERNAME]: '',
    [E_USER_ENTITY_KEYS.PASSWORD]: '',
  });

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(data);
  };

  return (
    <Card
      variant={'outlined'}
      sx={{ width: '50%' }}
      component={'form'}
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <CardHeader title={'Login'} />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            value={data[E_USER_ENTITY_KEYS.USERNAME]}
            label={'Username or E-Mail'}
            name={E_USER_ENTITY_KEYS.USERNAME}
            autoComplete={'username'}
          />
          <TextField
            type={'password'}
            value={data[E_USER_ENTITY_KEYS.PASSWORD]}
            label={'Password'}
            name={E_USER_ENTITY_KEYS.PASSWORD}
            autoComplete={'current-password'}
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant={'text'}
          color={'primary'}
          component={Link}
          to={[routesPaths.auth.root, routesPaths.auth.register].join('/')}
          unstable_viewTransition
        >
          Register
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant={'text'} color={'primary'} type={'submit'}>
          Login
        </Button>
      </CardActions>
    </Card>
  );
};
