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
  const isLoading = useAppSelector(videoIsLoadingSelector);
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const groupedAnnotations: Record<string, Array<TAnnotation>> = useAppSelector(
    selectAnnotationsGrouped,
  );
  const ungroupedAnnotations = useAppSelector(selectAnnotationsUngrouped);

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
