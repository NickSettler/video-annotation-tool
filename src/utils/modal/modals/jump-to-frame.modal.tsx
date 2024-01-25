import { ChangeEvent, FormEvent, JSX, useState } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { FormGroup, Stack, TextField } from '@mui/material';
import { BaseModalFooter } from '../base-modal-footer';

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

  return (
    <BaseModal
      show
      title={'Jump to frame'}
      onClose={onClose}
      onSubmit={handleApply}
      footer={
        <BaseModalFooter
          cancelTitle={'Cancel'}
          onCancel={onClose}
          applyTitle={'Go'}
          onApply={handleApply}
        />
      }
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
