import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { JSX } from 'react';
import { BaseModalFooter } from '../base-modal-footer';
import { Typography } from '@mui/material';

export type TConfirmDialogModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.CONFIRM_DIALOG>;

const ConfirmDialogModal = ({
  title,
  description,
  role,
  onConfirm,
  onClose,
}: TConfirmDialogModalProps): JSX.Element => {
  const handleApply = () => {
    onConfirm();
    onClose();
  };

  return (
    <BaseModal
      show
      title={title}
      onClose={onClose}
      onSubmit={handleApply}
      footer={
        <BaseModalFooter
          cancelTitle={'Cancel'}
          onCancel={onClose}
          applyTitle={'Confirm'}
          onApply={handleApply}
          role={role}
        />
      }
    >
      {description && <Typography>{description}</Typography>}
    </BaseModal>
  );
};

export default ConfirmDialogModal;
