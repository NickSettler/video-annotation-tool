import { ChangeEvent, FormEvent, JSX, useState } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { Box, Button, FormGroup, Stack, TextField } from '@mui/material';

export type TJumpToFrameModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.JUMP_TO_FRAME>;

const JumpToFrameModal = ({
  onClose,
  onSuccess,
}: TJumpToFrameModalProps): JSX.Element => {
  const [frame, setFrame] = useState<number>(0);

  const handleFrameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFrame(Number(event.target.value));
  };

  const handleApply = (event: FormEvent) => {
    event.preventDefault();

    onSuccess(frame);
    onClose();
  };

  const footer = (): JSX.Element => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button type={'button'} color={'muted'} onClick={onClose}>
        Cancel
      </Button>
      <Button type={'submit'} color={'primary'} onClick={handleApply}>
        Go
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
        <Stack direction={'column'} gap={2}>
          <TextField
            size={'small'}
            label={'Frame'}
            value={frame}
            onChange={handleFrameChange}
          />
        </Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default JumpToFrameModal;
