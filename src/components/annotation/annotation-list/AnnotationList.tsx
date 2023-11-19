import {
  Divider,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationsGrouped,
  selectCurrentFrameAnnotation,
  selectUngroupedAnnotations,
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
import { entries, isArray } from 'lodash';
import { AnnotationGroupListItem } from './AnnotationGroupListItem';

export type TAnnotationListProps<ID = any> = {
  rowSelection: Array<ID>;
  onRowSelectionChange(id: ID): void;
};

export const AnnotationList = ({
  rowSelection,
  onRowSelectionChange,
}: TAnnotationListProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(videoIsLoadingSelector);
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const groupedAnnotations: Record<string, Array<TAnnotation>> = useAppSelector(
    selectAnnotationsGrouped,
  );
  const ungroupedAnnotations = useAppSelector(selectUngroupedAnnotations);
  const currentFrameAnnotations = useAppSelector(selectCurrentFrameAnnotation);

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
    // if (!allAnnotations.length) return;
    //
    // downloadAsJson(
    //   allAnnotations
    //     .filter((annotation) => annotation)
    //     .map((annotation) =>
    //       annotation ? processFrameAnnotations(annotation) : [],
    //     ),
    //   'annotations',
    // );
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

  if (isLoading) return <LinearProgress />;

  if (!isLoaded) return <></>;

  return (
    <List dense disablePadding>
      {entries(groupedAnnotations).map(([id, annotations]) => (
        <AnnotationGroupListItem key={`group-${id}`} id={id} />
      ))}
      {!!entries(groupedAnnotations).length &&
        !!ungroupedAnnotations.length && <Divider />}
      {ungroupedAnnotations.map((annotation, index) => (
        <ListItemButton
          key={`${annotation.id}-${annotation.properties.frame}-${index}`}
          onClick={() => onRowSelectionChange(`${annotation.id}`)}
          onDoubleClick={() => console.log('SsSS')}
          selected={rowSelection.includes(`${annotation.id}`)}
        >
          <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
            <Circle sx={{ color: annotation.properties.color }} />
          </ListItemIcon>
          <ListItemText
            primary={annotation.properties?.name ?? <i>Nso Name</i>}
            secondary={`Frame: ${annotation.properties.frame}`}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
