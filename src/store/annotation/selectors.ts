import { TAppState } from '../store';
import { TAnnotationState } from './types';
import { moduleName } from './actions';
import { createSelector } from '@reduxjs/toolkit';

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
