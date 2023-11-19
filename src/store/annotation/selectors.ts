import { TAppState } from '../store';
import { TAnnotationState } from './types';
import { moduleName } from './actions';
import { createSelector } from '@reduxjs/toolkit';
import { videoCurrentFrameSelector } from '../video';
import { flattenDepth, uniqBy } from 'lodash';

const annotationState = (state: TAppState): TAnnotationState =>
  state[moduleName];

export const selectAllAnnotations = createSelector(
  annotationState,
  (annotation) => annotation.annotations,
);

export const selectFrameAnnotations = createSelector(
  [selectAllAnnotations, (_: TAppState, frame: number) => frame],
  (annotations, frame) => annotations[frame],
);

export const selectAnnotationsById = createSelector(
  selectAllAnnotations,
  (annotations) => uniqBy(flattenDepth(annotations, 1), 'id'),
);

export const selectCurrentFrameAnnotation = createSelector(
  selectAllAnnotations,
  videoCurrentFrameSelector,
  (annotations, frame) => annotations[frame],
);
