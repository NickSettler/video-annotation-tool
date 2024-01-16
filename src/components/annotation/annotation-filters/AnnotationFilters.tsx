import { JSX } from 'react';
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationTypeFilter,
  selectAnnotationTypes,
  setAnnotationTypeFilterAction,
} from '../../../store/annotation';
import { Close } from '@mui/icons-material';
import { AnnotationTypeListItem } from '../annotation-type-list-item/AnnotationTypeListItem';

export const AnnotationFilters = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationTypes = useAppSelector(selectAnnotationTypes);
  const annotationTypeFilter = useAppSelector(selectAnnotationTypeFilter);

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    dispatch(
      setAnnotationTypeFilterAction({
        type: event.target.value,
      }),
    );
  };

  const handleClearTypeFilter = () => {
    dispatch(setAnnotationTypeFilterAction({ type: null }));
  };

  return (
    <Stack direction={'column'} spacing={2}>
      <Stack direction={'column'} spacing={1}>
        <Typography variant={'subtitle1'}>Annotation Type</Typography>
        <Select
          fullWidth
          size={'small'}
          value={annotationTypeFilter ?? 'All'}
          onChange={handleTypeFilterChange}
          renderValue={(value) => {
            const annotationType = annotationTypes.find(
              (_annotationType) => _annotationType.type === value,
            );

            if (!annotationType) return value;

            return (
              <Stack direction={'row'} alignItems={'center'}>
                <AnnotationTypeListItem annotation={annotationType} />
              </Stack>
            );
          }}
          {...(!!annotationTypeFilter && {
            endAdornment: (
              <IconButton
                sx={{ mr: 2 }}
                size={'small'}
                onClick={handleClearTypeFilter}
              >
                <Close sx={{ fontSize: '1em' }} />
              </IconButton>
            ),
          })}
        >
          <MenuItem>All</MenuItem>
          {annotationTypes.map((annotationType) => (
            <MenuItem key={annotationType.type} value={annotationType.type}>
              <AnnotationTypeListItem annotation={annotationType} />
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};
