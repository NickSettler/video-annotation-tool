import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationEndFrameFilter,
  selectAnnotationStartFrameFilter,
  selectAnnotationTypeFilter,
  setAnnotationTypeFilterAction,
  setEndFrameFilterAction,
  setStartFrameFilterAction,
} from '../../../store/annotation';
import { Chip, Stack } from '@mui/material';

export const AnnotationFiltersOverview = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationTypeFilter = useAppSelector(selectAnnotationTypeFilter);
  const startFrameFilter = useAppSelector(selectAnnotationStartFrameFilter);
  const endFrameFilter = useAppSelector(selectAnnotationEndFrameFilter);

  const handleClearTypeFilter = () => {
    dispatch(setAnnotationTypeFilterAction({ type: null }));
  };

  const handleClearStartFrameFilter = () => {
    dispatch(setStartFrameFilterAction({ frame: null }));
  };

  const handleClearEndFrameFilter = () => {
    dispatch(setEndFrameFilterAction({ frame: null }));
  };

  return (
    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
      {annotationTypeFilter && (
        <Chip
          variant={'soft'}
          size={'small'}
          color={'primary'}
          label={`Type: ${annotationTypeFilter}`}
          onDelete={handleClearTypeFilter}
        />
      )}
      {startFrameFilter && (
        <Chip
          variant={'soft'}
          size={'small'}
          color={'primary'}
          label={`From frame: ${startFrameFilter}`}
          onDelete={handleClearStartFrameFilter}
        />
      )}
      {endFrameFilter && (
        <Chip
          variant={'soft'}
          size={'small'}
          color={'primary'}
          label={`To frame: ${endFrameFilter}`}
          onDelete={handleClearEndFrameFilter}
        />
      )}
    </Stack>
  );
};
