import { TAppState } from '../store';
import { TAnnotationState } from './types';
import { moduleName } from './actions';
import { createSelector } from '@reduxjs/toolkit';
import { videoCurrentFrameSelector } from '../video';
import { filter, flattenDepth, groupBy, omitBy, uniqBy } from 'lodash';

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
