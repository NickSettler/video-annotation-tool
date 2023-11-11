import { ChangeEvent, FormEvent, JSX, useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setVideoUrlAction, videoUrlSelector } from '../../store/video';

export const AddressBar = (): JSX.Element => {
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
    <Stack
      direction={'row'}
      alignItems={'stretch'}
      spacing={2}
      component={'form'}
      onSubmit={handleSubmit}
    >
      <TextField
        fullWidth
        size={'small'}
        autoComplete={'url'}
        label={'Video URL'}
        placeholder={'https://server.com/video.mp4'}
        value={url}
        onChange={handleURLChange}
      />
      <Button variant={'contained'} type={'submit'}>
        Load
      </Button>
    </Stack>
  );
};
