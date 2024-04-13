import {
  ChangeEvent,
  FormEvent,
  JSX,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { BaseModalFooter } from '../base-modal-footer';
import {
  Stack,
  styled,
  TextField,
  Box,
  IconButton,
  alpha,
} from '@mui/material';
import { useVideoMutations } from '../../../hooks/video/useVideoMutations';
import { useVideos } from '../../../hooks/video/useVideoQuery';
import { DropzoneArea } from 'mui-file-dropzone';
import { Delete } from '@mui/icons-material';
import { E_VIDEO_ENTITY_KEYS } from '../../../api/video/types';
import { isEmpty } from 'lodash';
import { toast } from 'react-hot-toast';

const PreviewContainer = styled(Box)({
  position: 'relative',
  width: '50%',
});

const VideoPreview = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  overflow: 'hidden',

  '& > *': {
    zIndex: 2,
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: alpha(theme.palette.error.light, 0.24),
    zIndex: 1,
  },
}));

export type TVideoUploadModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.VIDEO_UPLOAD>;

const VideoUploadModal = ({
  onClose,
  onSuccess,
}: TVideoUploadModalProps): JSX.Element => {
  const { refetch } = useVideos();

  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { createMutation } = useVideoMutations({
    refetch,
  });

  const [isPending, isSuccess, isError] = useMemo(
    () => [
      createMutation.isPending,
      createMutation.isSuccess,
      createMutation.isError,
    ],
    [createMutation],
  );

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = async (loadedFiles?: Array<File>) => {
    const loadedFile = loadedFiles?.[0];

    if (!loadedFile) return;

    setFile(loadedFile || null);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.createElement('video');

    if (!ctx) return;

    video.addEventListener(
      'loadedmetadata',
      function (event) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      },
      false,
    );

    video.addEventListener('timeupdate', () => {
      video.pause();

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      setPreviewImage(canvas.toDataURL('image/jpeg', 1.0));

      video.remove();
      canvas.remove();
    });

    video.muted = true;
    video.src = URL.createObjectURL(loadedFile);
    await video.play();
  };

  const handleDelete = () => {
    setFile(null);
    setPreviewImage(null);
  };

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (isEmpty(name)) {
      toast.error('Please enter a name');
      return;
    }

    await createMutation
      .mutateAsync({
        data: {
          [E_VIDEO_ENTITY_KEYS.NAME]: name,
          video: file,
        },
      })
      .then((data) => {
        if (onSuccess) onSuccess(data);
      });
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
          cancelDisabled={isPending}
          onCancel={onClose}
          applyTitle={'Go'}
          applyDisabled={isPending}
          onApply={handleApply}
        />
      }
    >
      <Stack gap={2}>
        <TextField
          variant={'outlined'}
          label={'Name'}
          value={name}
          disabled={isPending}
          onChange={handleNameChange}
        />
        <Stack direction={'row'} spacing={2}>
          <DropzoneArea
            dropzoneProps={{ disabled: isPending }}
            filesLimit={1}
            maxFileSize={Infinity}
            fileObjects={file}
            acceptedFiles={['video/*']}
            onChange={handleFileChange}
            showFileNames
            showPreviews={false}
            showPreviewsInDropzone={false}
          />
          {previewImage && (
            <PreviewContainer>
              <VideoPreview src={previewImage} alt={'Preview'} />
              <DeleteIconButton
                onClick={handleDelete}
                color={'error'}
                size={'small'}
                disabled={isPending}
              >
                <Delete fontSize={'small'} />
              </DeleteIconButton>
            </PreviewContainer>
          )}
        </Stack>
      </Stack>
    </BaseModal>
  );
};

export default VideoUploadModal;
