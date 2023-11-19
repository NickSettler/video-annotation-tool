import React, { ChangeEvent, FormEvent, JSX, useEffect, useState } from 'react';
import {
  alpha,
  AppBar,
  Button,
  IconButton,
  InputBase,
  LinearProgress,
  Stack,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link, Settings } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  setVideoUrlAction,
  videoIsLoadingSelector,
  videoUrlSelector,
} from '../../../store/video';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: theme.transitions.create('background'),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  '&:has(input:disabled)': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchProgress = styled(LinearProgress)({
  position: 'absolute',
  top: 0,
  width: '100%',
});

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

export const AppToolbar = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const storeUrl = useAppSelector(videoUrlSelector);
  const isVideoLoading = useAppSelector(videoIsLoadingSelector);

  const { onOpen: handleModalOpen } = useModal(E_MODALS.PROJECT_SETTINGS);

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
    <AppBar
      component='nav'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant='h6'>Video Annotation Tool</Typography>
        <Stack
          direction={'row'}
          justifyContent={'center'}
          position={'relative'}
          spacing={1}
          flexGrow={1}
          component={'form'}
          onSubmit={handleSubmit}
        >
          <Search>
            {isVideoLoading && <SearchProgress />}
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
        <Stack direction={'row'} spacing={1}>
          <IconButton color={'inherit'} onClick={handleModalOpen}>
            <Settings />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
