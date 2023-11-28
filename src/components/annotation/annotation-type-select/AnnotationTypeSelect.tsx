import { JSX, SyntheticEvent, useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteValue,
  createFilterOptions,
  FilterOptionsState,
  MenuItem,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  addAnnotationTypeAction,
  selectAnnotationTypes,
  TAnnotationType,
} from '../../../store/annotation';
import { find } from 'lodash';
import { Circle } from '@mui/icons-material';

export type TAnnotationTypeSelectProps = {
  value: string | null;
  onChange(value: TAnnotationType | null): void;
};

const filterAnnotations = createFilterOptions<TAnnotationType>();

export const AnnotationTypeSelect = ({
  value: propsValue,
  onChange,
}: TAnnotationTypeSelectProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationTypes = useAppSelector(selectAnnotationTypes);

  const [value, setValue] = useState<TAnnotationType | null>(null);

  useEffect(() => {
    if (propsValue)
      setValue(find(annotationTypes, { type: propsValue }) ?? null);
    else setValue(null);
  }, [propsValue, annotationTypes]);

  const handleFilterOptions = (
    options: Array<TAnnotationType>,
    params: FilterOptionsState<TAnnotationType>,
  ) => {
    const filtered = filterAnnotations(options, params);

    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.type);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        type: `Add ${inputValue}`,
        color: '$NEW$',
      });
    }

    return filtered;
  };

  const handleGetOptionLabel = (option: TAnnotationType | string) => {
    if (typeof option === 'string') return option;
    return option.type;
  };

  const handleChange = (
    _: SyntheticEvent,
    newValue: AutocompleteValue<TAnnotationType, false, false, true>,
  ) => {
    if (typeof newValue === 'string') return;

    if (newValue?.color === '$NEW$') {
      newValue.color = '#000000';
      newValue.type = newValue.type.replace('Add ', '');
      dispatch(
        addAnnotationTypeAction({
          type: newValue,
        }),
      );
    }

    setValue(newValue);

    onChange(newValue);
  };

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      fullWidth
      value={value}
      onChange={handleChange}
      getOptionLabel={handleGetOptionLabel}
      filterOptions={handleFilterOptions}
      renderOption={(params, option) => (
        <MenuItem
          {...params}
          {...(option.color === '$NEW$' && { sx: { color: 'gray' } })}
        >
          <Circle
            sx={{
              color: option.color === '$NEW$' ? 'transparent' : option.color,
              mr: 1,
            }}
          />
          {option.type}
        </MenuItem>
      )}
      renderInput={(params) => <TextField {...params} label={'Type'} />}
      options={annotationTypes}
    />
  );
};
