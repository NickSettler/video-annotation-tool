import { TAppState } from '../store';
import { TAnnotationState } from './types';
import { moduleName } from './actions';
import { createSelector } from '@reduxjs/toolkit';
import { videoCurrentFrameSelector, videoFPSSelector } from '../video';
import {
  entries,
  filter,
  find,
  flattenDepth,
  groupBy,
  map,
  maxBy,
  minBy,
  omitBy,
  reduce,
  some,
  uniqBy,
} from 'lodash';
import { isAnnotationSelectionGroupable } from '../../utils/annotation/group';
import { filterAnnotations } from '../../utils/annotation/filter';
import { E_IMPORT_ANNOTATIONS_FILE_TYPE } from '../../utils/annotation/import';
import { DataGroupCollectionType, DataItem } from 'vis-timeline';

const annotationState = (state: TAppState): TAnnotationState =>
  state[moduleName];

// Filters
export const selectAnnotationTypeFilter = createSelector(
  annotationState,
  ({ typeFilter }) => typeFilter,
);

export const selectAnnotationStartFrameFilter = createSelector(
  annotationState,
  ({ startFrameFilter }) => startFrameFilter,
);

export const selectAnnotationEndFrameFilter = createSelector(
  annotationState,
  ({ endFrameFilter }) => endFrameFilter,
);

export const selectIsAnnotationsFiltered = createSelector(
  selectAnnotationTypeFilter,
  selectAnnotationStartFrameFilter,
  selectAnnotationEndFrameFilter,
  (typeFilter, startFrameFilter, endFrameFilter) =>
    typeFilter !== null || startFrameFilter !== null || endFrameFilter !== null,
);

// Annotations
export const selectAllAnnotations = createSelector(
  annotationState,
  selectIsAnnotationsFiltered,
  selectAnnotationTypeFilter,
  selectAnnotationStartFrameFilter,
  selectAnnotationEndFrameFilter,
  (annotation, isFiltered, typeFilter, startFrame, endFrame) =>
    isFiltered
      ? filterAnnotations(annotation.annotations, {
          type: typeFilter,
          from: startFrame,
          to: endFrame,
        })
      : annotation.annotations,
);

export const selectAllFlattenedAnnotations = createSelector(
  selectAllAnnotations,
  (annotations) => flattenDepth(annotations, 1),
);

export const selectFrameAnnotations = createSelector(
  [selectAllAnnotations, (_: TAppState, frame: number) => frame],
  (annotations, frame) => annotations[frame],
);

export const selectAnnotationsById = createSelector(
  selectAllFlattenedAnnotations,
  (annotations) => uniqBy(annotations, 'id'),
);

export const selectAnnotationById = (id: string) =>
  createSelector(selectAnnotationsById, (annotations) =>
    find(annotations, { id }),
  );

export const selectAnnotationsGrouped = createSelector(
  selectAllFlattenedAnnotations,
  (annotations) => omitBy(groupBy(annotations, 'id'), (a) => a.length <= 1),
);

export const selectAnnotationsGroupedById = (id: string) =>
  createSelector(selectAnnotationsGrouped, (annotations) => annotations[id]);

export const selectAnnotationsUngrouped = createSelector(
  selectAllFlattenedAnnotations,
  selectAnnotationsGrouped,
  (annotations, groupedAnnotations) =>
    filter(annotations, (annotation) => !groupedAnnotations[annotation.id]),
);

export const selectCurrentFrameAnnotation = createSelector(
  selectAllAnnotations,
  videoCurrentFrameSelector,
  (annotations, frame) => annotations[frame],
);

export const selectNextUngroupedAnnotation = createSelector(
  selectAnnotationsUngrouped,
  videoCurrentFrameSelector,
  (annotations, frame) =>
    annotations.find((annotation) => annotation.properties.frame > frame),
);

export const selectPreviousUngroupedAnnotation = createSelector(
  selectAnnotationsUngrouped,
  videoCurrentFrameSelector,
  (annotations, frame) =>
    annotations
      .slice()
      .reverse()
      .find((annotation) => annotation.properties.frame < frame),
);

// Timeline

export const selectTimelineGroups = createSelector(
  selectAnnotationsById,
  (annotations): DataGroupCollectionType =>
    annotations.map((annotation) => ({
      id: annotation.id,
      content: annotation.properties.name ?? annotation.id.split('-')[0],
      subgroupStack: true,
    })),
);

export const selectTimelineRangeItems = createSelector(
  selectAnnotationsGrouped,
  videoFPSSelector,
  (groupedAnnotations, videoFPS): Array<DataItem> => {
    if (!videoFPS) return [];

    return flattenDepth(
      map(entries(groupedAnnotations), ([id, annotations]) => {
        const minFrame = minBy(
          annotations,
          (annotation) => annotation.properties.frame,
        );
        const maxFrame = maxBy(
          annotations,
          (annotation) => annotation.properties.frame,
        );

        if (!minFrame || !maxFrame) return [];

        return reduce(
          annotations,
          (acc, annotation, index) => {
            if (index === 0) {
              acc.push({
                id: `${annotation.id}`,
                group: id,
                style: `--color: ${annotation.properties.color}`,
                type: 'point',
                content:
                  annotation.properties.name ?? annotation.id.split('-')[0],
                start: new Date((minFrame.properties.frame * 1000) / videoFPS),
              });
              return acc;
            }

            const prevAnnotation = annotations[index - 1];

            if (
              prevAnnotation.properties.frame + 1 !==
              annotation.properties.frame
            ) {
              acc.push({
                id: `${annotation.id}_${annotation.properties.frame}_${index}`,
                group: id,
                style: `--color: ${annotation.properties.color}`,
                type: 'point',
                content:
                  annotation.properties.name ?? annotation.id.split('-')[0],
                start: new Date(
                  (annotation.properties.frame * 1000) / videoFPS,
                ),
              });
            } else {
              acc[acc.length - 1] = {
                ...acc[acc.length - 1],
                id: `${acc[acc.length - 1].id}_${annotation.properties.frame}_${index}`,
                end: new Date((annotation.properties.frame * 1000) / videoFPS),
                type: 'range',
              };
            }

            return acc;
          },
          [] as Array<DataItem>,
        );
      }),
      1,
    );
  },
);

export const selectTimelinePointItems = createSelector(
  selectAnnotationsUngrouped,
  videoFPSSelector,
  (ungroupedAnnotations, videoFPS): Array<DataItem> => {
    if (!videoFPS) return [];

    return map(ungroupedAnnotations, (annotation) => ({
      id: `${annotation.id}`,
      group: `${annotation.id}`,
      className: 'diamond',
      style: `--color: ${annotation.properties.color}`,
      content: annotation.properties.name ?? annotation.id.split('-')[0],
      start: new Date((annotation.properties.frame * 1000) / videoFPS),
      type: 'point',
    }));
  },
);

// Selection
export const selectAnnotationsSelection = createSelector(
  annotationState,
  (annotation) => annotation.selection,
);

export const selectIsAnnotationSelectionGroupable = createSelector(
  selectAllFlattenedAnnotations,
  selectAnnotationsSelection,
  (annotations, selection) =>
    isAnnotationSelectionGroupable(annotations, selection),
);

export const selectIsAnnotationSelectionInterpolatable = createSelector(
  selectAnnotationsSelection,
  (selection) => selection.length === 2,
);

export const selectIsAnnotationSelected = (id: string, frame: number) =>
  createSelector(selectAnnotationsSelection, (selection) =>
    some(selection, { id, frame }),
  );

export const selectCurrentFrameAnnotationsSelection = createSelector(
  selectAnnotationsSelection,
  videoCurrentFrameSelector,
  (selection, frame) => filter(selection, { frame }),
);

export const selectCurrentFrameHasSelection = createSelector(
  selectCurrentFrameAnnotationsSelection,
  (selection) => selection.length > 0,
);

export const selectSelectionAnnotations = createSelector(
  selectAllFlattenedAnnotations,
  selectAnnotationsSelection,
  (annotations, selection) =>
    flattenDepth(
      filter(annotations, (annotation) =>
        some(selection, {
          id: annotation.id,
          frame: annotation.properties.frame,
        }),
      ),
      1,
    ),
);

// Types
export const selectAnnotationTypes = createSelector(
  annotationState,
  (annotation) => annotation.types,
);

export const selectAnnotationTypesKeys = createSelector(
  selectAnnotationTypes,
  (types) => map(types, 'type'),
);

// Import / Export
export const selectExportAnnotations = createSelector(
  annotationState,
  (annotation) => annotation.annotations,
);

export const selectImportJSON = createSelector(
  annotationState,
  (annotation) => annotation.importJSON,
);

export const selectImportFileMetadata = createSelector(
  annotationState,
  (annotation) => annotation.importFileMetadata,
);

export const selectImportFileType = createSelector(
  annotationState,
  (annotation) =>
    annotation.importFileType
      ? E_IMPORT_ANNOTATIONS_FILE_TYPE[annotation.importFileType]
      : null,
);

export const selectImportFileMap = createSelector(
  annotationState,
  (annotation) => annotation.importFileMap,
);
