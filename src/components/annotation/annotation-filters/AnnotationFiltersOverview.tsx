import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationTypeFilter,
  setAnnotationTypeFilterAction,
} from '../../../store/annotation';
import { Chip, Stack } from '@mui/material';

export const AnnotationFiltersOverview = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationTypeFilter = useAppSelector(selectAnnotationTypeFilter);

  const handleClearTypeFilter = () => {
    dispatch(setAnnotationTypeFilterAction({ type: null }));
  };

  return (
    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
      {annotationTypeFilter && (
        <Chip
          variant={'soft'}
          size={'small'}
          color={'primary'}
          label={`Type: ${annotationTypeFilter ?? 'All'}`}
          onDelete={handleClearTypeFilter}
        />
      )}
    </Stack>
  );
};
