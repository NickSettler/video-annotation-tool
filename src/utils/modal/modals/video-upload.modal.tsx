import { JSX } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { BaseModalFooter } from '../base-modal-footer';
import { Stack, TextField } from '@mui/material';
import { useVideoMutations } from '../../../hooks/video/useVideoMutations';
import { useVideos } from '../../../hooks/video/useVideoQuery';

export type TVideoUploadModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.VIDEO_UPLOAD>;

const VideoUploadModal = ({ onClose }: TVideoUploadModalProps): JSX.Element => {
  const { refetch } = useVideos();

  const { createMutation } = useVideoMutations({
    refetch,
  });

  const handleApply = () => {
    onClose();
  };

  return (
    <BaseModal
      show
      title={'Video upload'}
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
      <Stack gap={2}>
        <TextField />
      </Stack>
    </BaseModal>
  );
};

export default VideoUploadModal;
