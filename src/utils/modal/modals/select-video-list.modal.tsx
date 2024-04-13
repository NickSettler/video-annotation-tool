import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { JSX } from 'react';
import { BaseModalFooter } from '../base-modal-footer';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { E_VIDEO_ENTITY_KEYS, TVideo } from '../../../api/video/types';
import { useVideos } from '../../../hooks/video/useVideoQuery';
import { VideoRowItem } from '../../../components/video/dashboard/video-row-item/VideoRowItem';

export type TConfirmDialogModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.SELECT_VIDEO_LIST>;

const SelectVideoListModal = ({
  onSelect,
  onClose,
}: TConfirmDialogModalProps): JSX.Element => {
  const { data, refetch } = useVideos();

  const handleRefreshClick = async () => refetch();

  const handleSelect = (video: TVideo) => {
    onSelect(video);
    onClose();
  };

  return (
    <BaseModal
      show
      title={'Videos'}
      onClose={onClose}
      footer={<BaseModalFooter cancelTitle={'Cancel'} onCancel={onClose} />}
    >
      <Stack spacing={2}>
        <Stack direction={'row'}>
          <Box flexGrow={1} />
          <Button variant={'text'} size={'small'} onClick={handleRefreshClick}>
            Refresh videos
          </Button>
        </Stack>
        <Stack spacing={1}>
          {data?.map((video) => (
            <VideoRowItem
              video={video}
              key={video[E_VIDEO_ENTITY_KEYS.ID]}
              isReadonly
              onSelect={handleSelect}
            />
          ))}
        </Stack>
      </Stack>
    </BaseModal>
  );
};

export default SelectVideoListModal;
