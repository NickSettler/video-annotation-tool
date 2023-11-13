import { FormEvent, JSX } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { Box, Button, FormGroup, Stack } from '@mui/material';

export type TProjectSettingsModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.PROJECT_SETTINGS>;

const ProjectSettingsModal = ({
  onClose,
}: TProjectSettingsModalProps): JSX.Element => {
  const handleApply = (event: FormEvent) => {
    event.preventDefault();

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
      title={'Project settings'}
      onClose={onClose}
      onSubmit={handleApply}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }}>
        <Stack direction={'column'} gap={2}></Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default ProjectSettingsModal;
