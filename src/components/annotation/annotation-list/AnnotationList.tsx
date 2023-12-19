import { Divider, LinearProgress, List } from '@mui/material';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  selectAnnotationsGrouped,
  selectAnnotationsUngrouped,
  selectCurrentFrameAnnotation,
  setAllAnnotationsAction,
  setFrameAnnotationsAction,
  TAnnotation,
  TAnnotationSelection,
} from '../../../store/annotation';
import {
  videoCurrentFrameSelector,
  videoIsLoadedSelector,
  videoIsLoadingSelector,
} from '../../../store/video';
import { TGenericMenuAction } from '../../common/generic-menu/GenericMenu';
import { FileDownload, FileUpload } from '@mui/icons-material';
import { downloadAsJson } from '../../../utils/files/download';
import { FeatureCollection } from 'geojson';
import { entries, isArray, some } from 'lodash';
import { AnnotationGroupListItem } from './AnnotationGroupListItem';
import { AnnotationListItem } from './AnnotationListItem';
import { E_ANNOTATION_DISPLAY_TYPE } from '../../../utils/annotation/types';

export type TAnnotationListProps = {
  selection: Array<TAnnotationSelection>;
  onSelectionChange(annotationSelection: TAnnotationSelection): void;
};

export const AnnotationList = ({
  selection,
  onSelectionChange,
}: TAnnotationListProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(videoIsLoadingSelector);
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const groupedAnnotations: Record<string, Array<TAnnotation>> = useAppSelector(
    selectAnnotationsGrouped,
  );
  const ungroupedAnnotations = useAppSelector(selectAnnotationsUngrouped);
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

  const handleSelectionChange = (id: string, frame: number) => () => {
    onSelectionChange({ id, frame });
  };

  if (isLoading) return <LinearProgress />;

  if (!isLoaded) return <></>;

  return (
    <List dense disablePadding>
      {entries(groupedAnnotations).map(([id]) => (
        <AnnotationGroupListItem key={`group-${id}`} id={id} />
      ))}
      {!!entries(groupedAnnotations).length &&
        !!ungroupedAnnotations.length && <Divider />}
      {ungroupedAnnotations.map((annotation, index) => (
        <AnnotationListItem
          key={`${annotation.id}-${annotation.properties.frame}-${index}`}
          annotation={annotation}
          type={E_ANNOTATION_DISPLAY_TYPE.POINT}
          isEditable
          isSelectable
          isSelected={some(selection, {
            id: annotation.id,
            frame: annotation.properties.frame,
          })}
          onSelected={handleSelectionChange(
            annotation.id,
            annotation.properties.frame,
          )}
        />
      ))}
    </List>
  );
};
