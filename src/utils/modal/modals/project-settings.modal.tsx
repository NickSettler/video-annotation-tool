import {
  FormEvent,
  JSX,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { Box, Button, FormGroup, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationTypes,
  setAnnotationTypesAction,
  TAnnotationType,
} from '../../../store/annotation';
import { unionBy } from 'lodash';
import { Circle } from '@mui/icons-material';
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';

const ColorEditComponent = (props: GridRenderEditCellParams) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleCircleClick = () => {
    ref.current?.click();
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Stack direction={'row'} alignItems={'center'} gap={1}>
      <Circle sx={{ color: value }} onClick={handleCircleClick} />
      <input
        ref={ref}
        type={'color'}
        value={value}
        onChange={handleValueChange}
      />
    </Stack>
  );
};

export type TProjectSettingsModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.PROJECT_SETTINGS>;

const ProjectSettingsModal = ({
  onClose,
}: TProjectSettingsModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const colorsMap = useAppSelector(selectAnnotationTypes);

  const [rows, setRows] = useState<Array<TAnnotationType>>([]);

  useEffect(() => {
    setRows(colorsMap);
  }, [colorsMap]);

  const handleApply = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      dispatch(
        setAnnotationTypesAction({
          types: rows,
        }),
      );

      onClose();
    },
    [dispatch, onClose, rows],
  );

  const handleRowUpdate = (newRow: any) => {
    setRows((prevRows) => unionBy([newRow], prevRows, 'type'));

    return newRow;
  };

  const columns: Array<GridColDef> = [
    {
      type: 'string',
      field: 'type',
      headerName: 'Annotation type',
      flex: 1,
      editable: true,
    },
    {
      type: 'string',
      field: 'color',
      headerName: 'Colors',
      flex: 1,
      editable: true,
      renderEditCell: (params) => <ColorEditComponent {...params} />,
      renderCell: (params) => (
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Circle sx={{ color: params.value }} />
          {params.value}
        </Stack>
      ),
    },
  ];

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
      title={'Project settings'}
      onClose={onClose}
      onSubmit={handleApply}
      footer={footer()}
    >
      <Stack gap={2}>
        <Stack gap={1}>
          <Typography variant={'h6'}>Palette</Typography>
          <DataGrid
            editMode={'row'}
            processRowUpdate={handleRowUpdate}
            columns={columns}
            rows={rows}
            getRowId={(r) => r.type}
          />
        </Stack>
      </Stack>
      <FormGroup sx={{ pt: 1, gap: 2 }}>
        <Stack direction={'column'} gap={2}></Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default ProjectSettingsModal;
