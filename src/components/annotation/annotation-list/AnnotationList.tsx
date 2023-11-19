import {
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
} from '@mui/material';
import { JSX, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAllAnnotations,
  selectCurrentFrameAnnotation,
  setAllAnnotationsAction,
  setFrameAnnotationsAction,
  TAnnotation,
} from '../../../store/annotation';
import {
  videoCurrentFrameSelector,
  videoIsLoadedSelector,
  videoIsLoadingSelector,
} from '../../../store/video';
import { TGenericMenuAction } from '../../common/generic-menu/GenericMenu';
import { Circle, FileDownload, FileUpload } from '@mui/icons-material';
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

  const [rowSelection, setRowSelection] = useState<Array<number>>([]);

  const processFrameAnnotations = (
    annotations: Array<TAnnotation>,
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
                annotations: annotations.features as Array<TAnnotation>,
              }),
            );
          }

          if (isArray(annotations)) {
            dispatch(
              setAllAnnotationsAction(
                annotations.map(
                  (annotation) => annotation.features as Array<TAnnotation>,
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

  const handleRowClick = (index: number) => () => {
    setRowSelection((prev) => {
      if (prev.includes(index)) return prev.filter((item) => item !== index);

      return [...prev, index];
    });
  };

  if (isLoading) return <LinearProgress />;

  if (!isLoaded) return <></>;

  return (
    <List dense disablePadding>
      {currentFrameAnnotations?.map((annotation, index) => (
        <ListItemButton
          key={annotation.id}
          onClick={handleRowClick(index)}
          selected={rowSelection.includes(index)}
        >
          <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
            <Circle sx={{ color: annotation.properties.color }} />
          </ListItemIcon>
          <ListItemText
            primary={annotation.properties?.name ?? <i>Nso Name</i>}
            secondary={annotation.id}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
