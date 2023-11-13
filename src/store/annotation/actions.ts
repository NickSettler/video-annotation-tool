import { createAction } from '@reduxjs/toolkit';
import { TFrameAnnotation } from './types';

export const moduleName = 'annotation';

export enum E_ANNOTATION_ACTIONS {
  SET_FRAME_ANNOTATION = `${moduleName}/SET_FRAME_ANNOTATION`,
}

export const setFrameAnnotationAction = createAction<{
  frame: number;
  annotation: TFrameAnnotation;
}>(E_ANNOTATION_ACTIONS.SET_FRAME_ANNOTATION);
