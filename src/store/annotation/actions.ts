import { createAction } from '@reduxjs/toolkit';
import { TAnnotation } from './types';

export const moduleName = 'annotation';

export enum E_ANNOTATION_ACTIONS {
  SET_ALL_ANNOTATIONS = `${moduleName}/SET_ALL_ANNOTATIONS`,
  SET_FRAME_ANNOTATION = `${moduleName}/SET_FRAME_ANNOTATION`,
  SET_FRAME_ANNOTATIONS = `${moduleName}/SET_FRAME_ANNOTATIONS`,
}

export const setAllAnnotationsAction = createAction<Array<Array<TAnnotation>>>(
  E_ANNOTATION_ACTIONS.SET_ALL_ANNOTATIONS,
);

export const setFrameAnnotationAction = createAction<{
  frame: number;
  annotation: TAnnotation;
}>(E_ANNOTATION_ACTIONS.SET_FRAME_ANNOTATION);

export const setFrameAnnotationsAction = createAction<{
  frame: number;
  annotations: Array<TAnnotation>;
}>(E_ANNOTATION_ACTIONS.SET_FRAME_ANNOTATIONS);
