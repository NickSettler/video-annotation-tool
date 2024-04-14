import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { ChangeEvent, FormEvent, JSX, useMemo, useState } from 'react';
import { BaseModalFooter } from '../base-modal-footer';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { E_PROJECT_ENTITY_KEYS, TProject } from '../../../api/projects/types';
import { useModal } from '../../../hooks/modal/useModal';
import { VideoRowItem } from '../../../components/video/dashboard/video-row-item/VideoRowItem';
import { isEmpty } from 'lodash';
import { useProjects } from '../../../hooks/projects/useProjects';
import { useProjectMutations } from '../../../hooks/projects/useProjectMutations';
import { toast } from 'react-hot-toast';
import { E_VIDEO_ENTITY_KEYS } from '../../../api/video/types';

export type TCreateProjectModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.VIDEO_UPLOAD>;

const CreateProjectModal = ({
  onClose,
}: TCreateProjectModalProps): JSX.Element => {
  const { refetch } = useProjects();

  const { createMutation } = useProjectMutations({
    refetch,
  });

  const { onOpen: openVideoUploadModal } = useModal(E_MODALS.VIDEO_UPLOAD);
  const { onOpen: openSelectVideoListModal } = useModal(
    E_MODALS.SELECT_VIDEO_LIST,
  );

  const [name, setName] = useState<TProject[E_PROJECT_ENTITY_KEYS.NAME]>('');
  const [video, setVideo] = useState<
    TProject[E_PROJECT_ENTITY_KEYS.VIDEO] | null
  >(null);

  const isCreateDisabled = useMemo(
    () => isEmpty(name) || !video,
    [name, video],
  );

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSelectVideoClick = () => {
    openSelectVideoListModal({
      onSelect: setVideo,
    });
  };

  const handleUploadVideoClick = () => {
    openVideoUploadModal({
      onSuccess: setVideo,
    });
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (isEmpty(name)) {
      toast.error('Name is required');
      return;
    }

    if (!video) {
      toast.error('Video is required');
      return;
    }

    await createMutation
      .mutateAsync({
        data: {
          [E_PROJECT_ENTITY_KEYS.NAME]: name,
          [E_PROJECT_ENTITY_KEYS.VIDEO_ID]: video[E_VIDEO_ENTITY_KEYS.ID],
        },
      })
      .then(() => onClose());
  };

  return (
    <BaseModal
      show
      title={'Create project'}
      onClose={onClose}
      onSubmit={handleCreate}
      footer={
        <BaseModalFooter
          cancelTitle={'Cancel'}
          onCancel={onClose}
          applyTitle={'Create'}
          applyDisabled={isCreateDisabled}
          onApply={handleCreate}
        />
      }
    >
      <Stack gap={2}>
        <Stack>
          <Typography variant={'h6'} sx={{ mb: 2 }}>
            Information
          </Typography>
          <TextField label={'Name'} value={name} onChange={handleNameChange} />
        </Stack>
        <Stack>
          <Typography variant={'h6'} sx={{ mb: 2 }}>
            Video
          </Typography>
          {video ? (
            <VideoRowItem video={video} isReadonly />
          ) : (
            <Typography variant={'body2'} color={'text.secondary'}>
              No video selected
            </Typography>
          )}
          <Stack direction={'row'} spacing={1} sx={{ mt: 1 }}>
            <Button
              variant={'contained'}
              disableElevation
              fullWidth
              size={'small'}
              onClick={handleUploadVideoClick}
            >
              Upload new video
            </Button>
            <Button
              variant={'contained'}
              disableElevation
              fullWidth
              size={'small'}
              onClick={handleSelectVideoClick}
            >
              Select existing video
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </BaseModal>
  );
};

export default CreateProjectModal;
