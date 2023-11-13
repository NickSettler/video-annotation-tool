import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAllAnnotations,
  selectCurrentFrameAnnotation,
  setAllAnnotationsAction,
  setFrameAnnotationsAction,
  TFrameAnnotation,
} from '../../../store/annotation';
import {
  videoCurrentFrameSelector,
  videoIsLoadedSelector,
  videoIsLoadingSelector,
} from '../../../store/video';
import {
  GenericMenu,
  TGenericMenuAction,
} from '../../general/generic-menu/GenericMenu';
import { FileDownload, FileUpload, MoreVert } from '@mui/icons-material';
import { downloadAsJson } from '../../../utils/files/download';
import { FeatureCollection } from 'geojson';
import { isArray } from 'lodash';

export const AnnotationListPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  overflow: 'auto',
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
}));

export const AnnotationList = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(videoIsLoadingSelector);
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const allAnnotations = useAppSelector(selectAllAnnotations);
  const currentFrameAnnotations = useAppSelector(selectCurrentFrameAnnotation);

  const processFrameAnnotations = (
    annotations: Array<TFrameAnnotation>,
  ): FeatureCollection => ({
    type: 'FeatureCollection',
    features: annotations,
  });

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const annotations = JSON.parse(reader.result as string);

          if (!isArray(annotations)) {
            dispatch(
              setFrameAnnotationsAction({
                frame: currentFrame,
                annotations: annotations.features as Array<TFrameAnnotation>,
              }),
            );
          }

          if (isArray(annotations)) {
            dispatch(
              setAllAnnotationsAction(
                annotations.map(
                  (annotation) =>
                    annotation.features as Array<TFrameAnnotation>,
                ),
              ),
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    if (!currentFrameAnnotations?.length) return;

    downloadAsJson(
      processFrameAnnotations(currentFrameAnnotations),
      `annotations-${currentFrame}`,
    );
  };

  const handleExportAll = () => {
    if (!allAnnotations.length) return;

    downloadAsJson(
      allAnnotations
        .filter((annotation) => annotation)
        .map((annotation) =>
          annotation ? processFrameAnnotations(annotation) : [],
        ),
      'annotations',
    );
  };

  const menuActions: Array<TGenericMenuAction> = [
    {
      label: 'Import',
      icon: FileUpload,
      action: handleImport,
    },
    {
      label: 'Export',
      icon: FileDownload,
      action: handleExport,
    },
    {
      label: 'Export All',
      icon: FileDownload,
      action: handleExportAll,
    },
  ];

  return (
    <AnnotationListPaper elevation={0} variant={'outlined'}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant={'h6'}>Annotations</Typography>
        <GenericMenu actions={menuActions} size={'small'}>
          <MoreVert />
        </GenericMenu>
      </Stack>
      {isLoading ? (
        <LinearProgress />
      ) : isLoaded ? (
        <List dense disablePadding>
          {currentFrameAnnotations?.map((annotation) => (
            <ListItem key={annotation.id}>
              <ListItemText
                primary={annotation.properties?.name ?? <i>No Name</i>}
                secondary={annotation.id}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <></>
      )}
    </AnnotationListPaper>
  );
};
