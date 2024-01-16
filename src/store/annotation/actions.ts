import { createAction } from '@reduxjs/toolkit';
import { TAnnotation, TAnnotationSelection, TAnnotationType } from './types';
import { DeepPartial, OmitByValue } from 'utility-types';

export const moduleName = 'annotation';

export enum E_ANNOTATION_ACTIONS {
  INIT_ANNOTATIONS = `${moduleName}/INIT_ANNOTATIONS`,
  SET_ALL_ANNOTATIONS = `${moduleName}/SET_ALL_ANNOTATIONS`,
  SET_FRAME_ANNOTATION = `${moduleName}/SET_FRAME_ANNOTATION`,
  SET_FRAME_ANNOTATIONS = `${moduleName}/SET_FRAME_ANNOTATIONS`,
  ADD_FRAME_ANNOTATION = `${moduleName}/ADD_FRAME_ANNOTATION`,
  UPDATE_POLYGON_COORDINATES = `${moduleName}/UPDATE_POLYGON_COORDINATES`,
  UPDATE_FRAME_POLYGON = `${moduleName}/UPDATE_FRAME_POLYGON`,
  UPDATE_POLYGON = `${moduleName}/UPDATE_POLYGON`,

  TOGGLE_SELECTION_ITEM = `${moduleName}/TOGGLE_SELECTION_ITEM`,
  GROUP_SELECTION = `${moduleName}/GROUP_SELECTION`,
  CLEAR_SELECTION = `${moduleName}/CLEAR_SELECTION`,

  SET_ANNOTATION_TYPES = `${moduleName}/SET_ANNOTATION_TYPES`,
  ADD_ANNOTATION_TYPE = `${moduleName}/ADD_ANNOTATION_TYPE`,

  SET_ANNOTATION_TYPE_FILTER = `${moduleName}/SET_ANNOTATION_TYPE_FILTER`,
}

export const initAnnotationsAction = createAction<{
  count: number;
}>(E_ANNOTATION_ACTIONS.INIT_ANNOTATIONS);

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

export const addFrameAnnotationAction = createAction<{
  frame: number;
  annotation: TAnnotation;
}>(E_ANNOTATION_ACTIONS.ADD_FRAME_ANNOTATION);

export const updatePolygonCoordinatesAction = createAction<{
  polygonID: string;
  frame: number;
  dx: number;
  dy: number;
}>(E_ANNOTATION_ACTIONS.UPDATE_POLYGON_COORDINATES);

export const updateFramePolygonAction = createAction<{
  frame: number;
  polygonID: string;
  payload: OmitByValue<DeepPartial<TAnnotation>, undefined>;
}>(E_ANNOTATION_ACTIONS.UPDATE_FRAME_POLYGON);

export const updatePolygonAction = createAction<{
  polygonID: string;
  payload: OmitByValue<DeepPartial<TAnnotation>, undefined>;
}>(E_ANNOTATION_ACTIONS.UPDATE_POLYGON);

export const toggleSelectionItemAction = createAction<TAnnotationSelection>(
  E_ANNOTATION_ACTIONS.TOGGLE_SELECTION_ITEM,
);

export const groupSelectionAction = createAction(
  E_ANNOTATION_ACTIONS.GROUP_SELECTION,
);

export const clearSelectionAction = createAction(
  E_ANNOTATION_ACTIONS.CLEAR_SELECTION,
);

export const setAnnotationTypesAction = createAction<{
  types: Array<TAnnotationType>;
}>(E_ANNOTATION_ACTIONS.SET_ANNOTATION_TYPES);

export const addAnnotationTypeAction = createAction<{
  type: TAnnotationType;
}>(E_ANNOTATION_ACTIONS.ADD_ANNOTATION_TYPE);

export const setAnnotationTypeFilterAction = createAction<{
  type: string | null;
}>(E_ANNOTATION_ACTIONS.SET_ANNOTATION_TYPE_FILTER);
