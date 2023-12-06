import { ChangeEvent, JSX, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationById,
  TAnnotation,
  TAnnotationType,
  updateFramePolygonAction,
  updatePolygonAction,
} from '../../../store/annotation';
import { Path } from '../../types/path.type';
import { isUndefined, omit, set } from 'lodash';
import { deepClone } from '@mui/x-data-grid/utils/utils';
import { AnnotationTypeSelect } from '../../../components/annotation/annotation-type-select/AnnotationTypeSelect';

export const EditAnnotationModalColorBox = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'annotationColor',
})<{ annotationColor: string }>(({ annotationColor }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: annotationColor,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 3,
}));
export const EditAnnotationModalColorText = styled(Typography)({
  backgroundClip: 'text',
  backgroundColor: 'inherit',
  color: 'transparent',
  filter: 'invert(1) sepia(1) grayscale(1) contrast(9)',
});

export type TEditAnnotationModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.EDIT_ANNOTATION>;

const EditAnnotationModal = ({
  onClose,
  id,
  frame,
}: TEditAnnotationModalProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentAnnotation = useAppSelector(selectAnnotationById(id));

  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [editAnnotation, setEditAnnotation] = useState<TAnnotation>({
    id: '',
    type: 'Feature',
    properties: {
      frame: frame ?? 0,
      name: '',
      color: '',
      type: null,
    },
    geometry: {
      type: 'MultiPoint',
      coordinates: [],
    },
  });

  const isGroupMode = useMemo(() => isUndefined(frame), [frame]);

  const modalTitle = useMemo(() => {
    if (isGroupMode) {
      return `Annotation group ${currentAnnotation?.properties.name}`;
    }

    return `Annotation ${currentAnnotation?.properties.name} [${currentAnnotation?.properties.frame}]`;
  }, [currentAnnotation, isGroupMode]);

  useEffect(() => {
    if (currentAnnotation) setEditAnnotation(currentAnnotation);
  }, [currentAnnotation]);

  const handleFieldChange =
    (path: Path<TAnnotation>) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setEditAnnotation((prev) => {
        const _prev = deepClone(prev);
        if (path === 'properties.color') set(_prev, 'properties.type', null);
        set(_prev, path, value);
        return _prev;
      });
    };

  const handleTypeChange = (type: TAnnotationType | null) => {
    if (!type) {
      if (currentAnnotation?.properties.color)
        setEditAnnotation((prev) => ({
          ...prev,
          properties: {
            ...prev.properties,
            color: currentAnnotation.properties.color,
          },
        }));

      return;
    }

    setEditAnnotation((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        color: type.color,
        type: type.type,
      },
    }));
  };

  const handleApply = () => {
    if (!isUndefined(frame)) {
      dispatch(
        updateFramePolygonAction({
          frame: frame,
          polygonID: id,
          payload: editAnnotation,
        }),
      );
    } else {
      dispatch(
        updatePolygonAction({
          polygonID: id,
          payload: omit(editAnnotation, ['properties.frame']),
        }),
      );
    }

    onClose();
  };

  const footer = (): JSX.Element => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button type={'button'} color={'muted'} onClick={onClose}>
        Cancel
      </Button>
      <Button type={'submit'} color={'primary'} onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );

  return (
    <BaseModal
      show
      title={modalTitle}
      onClose={onClose}
      onSubmit={handleApply}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }}>
        color: {editAnnotation.properties.color}
        <TextField value={editAnnotation.id} label={'ID'} disabled fullWidth />
        <TextField
          value={editAnnotation.type}
          label={'Type'}
          disabled
          fullWidth
        />
        <TextField
          value={editAnnotation.properties.name}
          onChange={handleFieldChange('properties.name')}
          label={'Name'}
          fullWidth
        />
        <Stack direction={'row'} spacing={2}>
          <Box width={'50%'}>
            <AnnotationTypeSelect
              value={editAnnotation.properties.type}
              onChange={handleTypeChange}
            />
          </Box>
          <Box
            width={'50%'}
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}
            position={'relative'}
          >
            <input
              ref={colorPickerRef}
              type={'color'}
              value={editAnnotation.properties.color}
              onChange={handleFieldChange('properties.color')}
            />
            <EditAnnotationModalColorBox
              annotationColor={editAnnotation.properties.color}
              onClick={() => colorPickerRef.current?.click()}
            >
              <EditAnnotationModalColorText variant={'overline'}>
                Color / {editAnnotation.properties.color}
              </EditAnnotationModalColorText>
            </EditAnnotationModalColorBox>
          </Box>
        </Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default EditAnnotationModal;
