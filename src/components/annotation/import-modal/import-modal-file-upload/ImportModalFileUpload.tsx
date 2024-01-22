import { JSX, useState } from 'react';
import { DropzoneArea } from 'mui-file-dropzone';
import { IconButton, Stack, Typography } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { getReadableFileSize } from '../../../../utils/files/size';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {
  selectImportFileMetadata,
  setImportFileMetadataAction,
  setImportFileTypeAction,
  setImportJSONAction,
} from '../../../../store/annotation';

export const ImportModalFileUpload = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const importFileMetadata = useAppSelector(selectImportFileMetadata);

  const [files, setFiles] = useState<Array<File>>([]);

  const handleFileChange = (loadedFiles?: Array<File>) => {
    setFiles(loadedFiles || []);

    const file = loadedFiles?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;

      if (!content || typeof content !== 'string') return;

      try {
        const parsedContent = JSON.parse(content);
        dispatch(setImportJSONAction(parsedContent));
        dispatch(
          setImportFileMetadataAction({
            name: file.name,
            size: file.size,
            type: file.type,
          }),
        );
      } catch (error) {
        toast.error('Invalid JSON file');
      }
    };

    reader.readAsText(file);
  };

  const handleFileDelete = () => {
    setFiles([]);
    dispatch(setImportJSONAction(null));
    dispatch(setImportFileMetadataAction(null));
    dispatch(setImportFileTypeAction(null));
  };

  return (
    <Stack gap={2}>
      <DropzoneArea
        filesLimit={1}
        maxFileSize={Infinity}
        fileObjects={files}
        acceptedFiles={['application/json']}
        onChange={handleFileChange}
        onDelete={handleFileDelete}
        showFileNames
        showPreviews={false}
        showPreviewsInDropzone={false}
      />
      <Stack gap={1}>
        {(importFileMetadata || !!files.length) && (
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={0.5}
          >
            <Stack gap={0.25}>
              <Typography variant={'body1'}>
                File name: {importFileMetadata?.name ?? files[0]?.name ?? ''}
              </Typography>
              <Typography variant={'body2'}>
                File size:{' '}
                {getReadableFileSize(
                  importFileMetadata?.size ?? files[0].size ?? -1,
                  'KB',
                )}
              </Typography>
            </Stack>
            <IconButton onClick={handleFileDelete}>
              <Clear />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
