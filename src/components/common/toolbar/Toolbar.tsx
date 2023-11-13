import React, { ChangeEvent, FormEvent, JSX, useEffect, useState } from 'react';
import {
  alpha,
  AppBar,
  InputBase,
  styled,
  Typography,
  Toolbar as MUIToolbar,
  Button,
  Stack,
} from '@mui/material';
import { Link } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setVideoUrlAction, videoUrlSelector } from '../../../store/video';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '44ch',
      '&:focus': {
        width: '52ch',
      },
    },
  },
}));

export const Toolbar = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const storeUrl = useAppSelector(videoUrlSelector);

  const [url, setUrl] = useState('https://www.fit.vutbr.cz/~iklima/out.mp4');

  useEffect(() => {
    if (storeUrl) setUrl(storeUrl);
  }, [storeUrl]);

  const handleURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(setVideoUrlAction(url));
  };

  return (
    <AppBar component='nav'>
      <MUIToolbar>
        <Typography variant='h6'>Video Annotation Tool</Typography>
        <Stack
          direction={'row'}
          justifyContent={'center'}
          spacing={1}
          flexGrow={1}
          component={'form'}
          onSubmit={handleSubmit}
        >
          <Search>
            <SearchIconWrapper>
              <Link />
            </SearchIconWrapper>
            <StyledInputBase
              value={url}
              onChange={handleURLChange}
              placeholder='Video URL'
            />
          </Search>
          <Button variant={'text'} type={'submit'} color={'inherit'}>
            Load
          </Button>
        </Stack>
      </MUIToolbar>
    </AppBar>
  );
};
