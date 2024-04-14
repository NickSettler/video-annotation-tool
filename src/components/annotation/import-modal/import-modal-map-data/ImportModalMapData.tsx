import { ChangeEvent, JSX, useEffect, useMemo, useState } from 'react';
import { DotNestedKeys, Path } from '../../../../utils/types/path.type';
import {
  selectImportFileMap,
  selectImportFileType,
  setImportFileMapAction,
  TAnnotation,
} from '../../../../store/annotation';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  entries,
  filter,
  fromPairs,
  isNull,
  keys,
  omit,
  omitBy,
  pickBy,
  reduce,
} from 'lodash';
import {
  ANNOTATION_FIELDS_HUMAN_DESCRIPTION,
  ANNOTATION_FIELDS_IMPORT_RULES,
  TAnnotationFieldImportRules,
} from '../../../../utils/annotation/import';
import { Clear } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

export const ImportModalMapData = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const importFileType = useAppSelector(selectImportFileType);
  const importFileMap = useAppSelector(selectImportFileMap);

  const [newFieldSelectValue, setNewFieldSelectValue] = useState<
    DotNestedKeys<TAnnotation> | ''
  >('');

  /**
   * Remove already mapped fields from the list of fields that can be mapped
   */
  const visibleAppendItems = useMemo(() => {
    const entriesKeys = keys(importFileMap);
    return fromPairs(
      filter(
        entries(ANNOTATION_FIELDS_HUMAN_DESCRIPTION),
        ([key]) => !entriesKeys.includes(key),
      ),
    );
  }, [importFileMap]);

  const fieldsRules: Record<
    DotNestedKeys<TAnnotation>,
    TAnnotationFieldImportRules
  > = useMemo(
    () =>
      importFileType
        ? ANNOTATION_FIELDS_IMPORT_RULES[importFileType]
        : ({} as typeof fieldsRules),
    [importFileType],
  );

  useEffect(() => {
    dispatch(
      setImportFileMapAction(
        reduce(
          keys(pickBy(fieldsRules, (value) => value.required)),
          (acc, key) => ({
            ...acc,
            [key]: '',
          }),
          {},
        ),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFileType]);

  const handleNewFieldSelectChange = (
    event: SelectChangeEvent<DotNestedKeys<TAnnotation>>,
  ) => {
    dispatch(
      setImportFileMapAction({
        ...importFileMap,
        [event.target.value]: '',
      }),
    );
  };

  const handleTextChange =
    (path: Path<TAnnotation>) => (event: ChangeEvent) => {
      const value = (event.target as HTMLInputElement).value;

      dispatch(
        setImportFileMapAction({
          ...importFileMap,
          [path]: value,
        }),
      );
    };

  const handleClear = (path: Path<TAnnotation>) => () => {
    dispatch(
      setImportFileMapAction({
        ...omit(importFileMap, path),
      }),
    );
  };

  return (
    <Stack gap={3}>
      <Typography variant={'body1'}>
        You can map the following annotation properties to fields in your array.
        Enter a path to the field in your array for the annotation property you
        want to map.
      </Typography>
      <Stack gap={2}>
        <Stack gap={0.5}>
          {entries(omitBy(importFileMap, isNull)).map(([path, text]) => (
            <Stack key={path} direction={'row'} alignItems={'start'} gap={1}>
              <TextField
                fullWidth
                size={'small'}
                label={
                  ANNOTATION_FIELDS_HUMAN_DESCRIPTION[
                    path as DotNestedKeys<TAnnotation>
                  ]
                }
                value={text ?? ''}
                required={
                  fieldsRules[path as DotNestedKeys<TAnnotation>].required
                }
                onChange={handleTextChange(path as DotNestedKeys<TAnnotation>)}
                helperText={path}
              />
              {!fieldsRules[path as DotNestedKeys<TAnnotation>].required && (
                <Tooltip title={'Remove mapping'}>
                  <IconButton
                    size={'small'}
                    onClick={handleClear(path as DotNestedKeys<TAnnotation>)}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ))}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <FormControl size={'small'} sx={{ width: '50%' }}>
            <InputLabel>Add mapping</InputLabel>
            <Select
              label={'Add mapping'}
              value={newFieldSelectValue}
              onChange={handleNewFieldSelectChange}
            >
              {entries(visibleAppendItems).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
};
