import { TAppState } from '../store';
import { TAnnotationState } from './types';
import { moduleName } from './actions';
import { createSelector } from '@reduxjs/toolkit';
import { videoCurrentFrameSelector } from '../video';
import { filter, flattenDepth, groupBy, omitBy, uniqBy } from 'lodash';
import {
  filter,
  flattenDepth,
  groupBy,
  omitBy,
  some,
  uniqBy,
} from 'lodash';
import { isAnnotationSelectionGroupable } from '../../utils/annotation/group';

const annotationState = (state: TAppState): TAnnotationState =>
  state[moduleName];

export const selectAllAnnotations = createSelector(
  annotationState,
  (annotation) => annotation.annotations,
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

export const selectAnnotationsGrouped = createSelector(
  selectAllFlattenedAnnotations,
  (annotations) => omitBy(groupBy(annotations, 'id'), (a) => a.length <= 1),
);

export const selectAnnotationsGroupedById = (id: string) =>
  createSelector(selectAnnotationsGrouped, (annotations) => annotations[id]);

export const selectUngroupedAnnotations = createSelector(
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
