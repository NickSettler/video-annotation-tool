import React, { JSX } from 'react';
import { Card, CardContent, Stack, styled, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {
  selectImportFileType,
  setImportFileTypeAction,
} from '../../../../store/annotation';
import { E_IMPORT_ANNOTATIONS_FILE_TYPE } from '../../../../utils/annotation/import';

const ImportModalFileTypeCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transitionProperty: 'border-color,border-width,box-shadow',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease-in-out',
  borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
  borderWidth: 2,
  boxShadow: selected ? theme.shadows[3] : 'none',

  '&:hover': {
    borderColor: theme.palette.primary.light,
  },

  '& > .MuiCardContent-root,& > .MuiCardContent-root:last-child': {
    padding: theme.spacing(1.5),
  },
}));

export const ImportModalFileType = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const importFileType = useAppSelector(selectImportFileType);

  const handleCardClick = (type: E_IMPORT_ANNOTATIONS_FILE_TYPE) => {
    dispatch(setImportFileTypeAction(type));
  };

  return (
    <Stack gap={2}>
      <ImportModalFileTypeCard
        variant='outlined'
        onClick={() =>
          handleCardClick(E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON)
        }
        selected={
          importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON
        }
      >
        <CardContent>
          <Typography variant='h6'>Application format</Typography>
          <Typography variant='body2' color='text.secondary'>
            Your data have been exported from this application. You can import
            them without any changes.
          </Typography>
        </CardContent>
      </ImportModalFileTypeCard>
      <ImportModalFileTypeCard
        variant='outlined'
        onClick={() =>
          handleCardClick(E_IMPORT_ANNOTATIONS_FILE_TYPE.FRAMES_ARRAY)
        }
        selected={
          importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.FRAMES_ARRAY
        }
      >
        <CardContent>
          <Typography variant='h6'>Array of frames</Typography>
          <Typography variant='body2' color='text.secondary'>
            Your data are stored as an array of frames. Each item in the array
            represents a frame in the order they appear in the video. Each frame
            is an array of polygons.
          </Typography>
        </CardContent>
      </ImportModalFileTypeCard>
      <ImportModalFileTypeCard
        variant='outlined'
        onClick={() =>
          handleCardClick(E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY)
        }
        selected={
          importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY
        }
      >
        <CardContent>
          <Typography variant='h6'>Array of polygons</Typography>
          <Typography variant='body2' color='text.secondary'>
            Your data are stored as an array of polygons. Each item in the array
            represents a polygon. Items in the array are not ordered. Each item
            contains property representing the frame number.
          </Typography>
        </CardContent>
      </ImportModalFileTypeCard>
      <ImportModalFileTypeCard
        variant='outlined'
        onClick={() => handleCardClick(E_IMPORT_ANNOTATIONS_FILE_TYPE.UNKNOWN)}
        selected={importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.UNKNOWN}
      >
        <CardContent>
          <Typography variant='h6'>Other</Typography>
          <Typography variant='body2' color='text.secondary'>
            Your data are stored in a different format. You will need to write a
            function to convert your data to the array of polygons format.{' '}
            <br />
            <b>This conversion is not supported yet.</b>
          </Typography>
        </CardContent>
      </ImportModalFileTypeCard>
    </Stack>
  );
};
