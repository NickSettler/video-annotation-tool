import { ChangeEvent, JSX } from 'react';
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationEndFrameFilter,
  selectAnnotationStartFrameFilter,
  selectAnnotationTypeFilter,
  selectAnnotationTypes,
  setAnnotationTypeFilterAction,
  setEndFrameFilterAction,
  setStartFrameFilterAction,
} from '../../../store/annotation';
import { Close } from '@mui/icons-material';
import { AnnotationTypeListItem } from '../annotation-type-list-item/AnnotationTypeListItem';
import { isEmpty } from 'lodash';
import { videoTotalFramesSelector } from '../../../store/video';

export const AnnotationFilters = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const videoTotalFrames = useAppSelector(videoTotalFramesSelector);
  const annotationTypes = useAppSelector(selectAnnotationTypes);
  const annotationTypeFilter = useAppSelector(selectAnnotationTypeFilter);
  const startFrameFilter = useAppSelector(selectAnnotationStartFrameFilter);
  const endFrameFilter = useAppSelector(selectAnnotationEndFrameFilter);

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

  const handleStartFrameFilterChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      setStartFrameFilterAction({
        frame: isEmpty(event.target.value)
          ? null
          : Math.max(
              Math.min(parseInt(event.target.value), videoTotalFrames),
              0,
            ),
      }),
    );
  };

  const handleEndFrameFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setEndFrameFilterAction({
        frame: isEmpty(event.target.value)
          ? null
          : Math.max(
              Math.min(parseInt(event.target.value), videoTotalFrames),
              0,
            ),
      }),
    );
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
      <Stack direction={'column'} spacing={1}>
        <Typography variant={'subtitle1'}>Frame Range</Typography>
        <Stack direction={'row'} spacing={1}>
          <TextField
            fullWidth
            size={'small'}
            type={'number'}
            label={'From'}
            variant={'outlined'}
            inputProps={{ min: 0, max: videoTotalFrames }}
            value={startFrameFilter ?? ''}
            onChange={handleStartFrameFilterChange}
          />
          <TextField
            fullWidth
            size={'small'}
            type={'number'}
            label={'To'}
            variant={'outlined'}
            inputProps={{ min: 0, max: videoTotalFrames }}
            value={endFrameFilter ?? ''}
            onChange={handleEndFrameFilterChange}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
