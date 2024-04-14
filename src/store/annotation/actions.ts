import { createAction } from '@reduxjs/toolkit';
import { TAnnotation, TAnnotationSelection, TAnnotationType } from './types';
import { DeepPartial, OmitByValue } from 'utility-types';
import { E_IMPORT_ANNOTATIONS_FILE_TYPE } from '../../utils/annotation/import';
import { DotNestedKeys } from '../../utils/types/path.type';

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

  // Selection actions
  TOGGLE_SELECTION_ITEM = `${moduleName}/TOGGLE_SELECTION_ITEM`,
  GROUP_SELECTION = `${moduleName}/GROUP_SELECTION`,
  CLEAR_SELECTION = `${moduleName}/CLEAR_SELECTION`,

  // Annotation types actions
  SET_ANNOTATION_TYPES = `${moduleName}/SET_ANNOTATION_TYPES`,
  ADD_ANNOTATION_TYPE = `${moduleName}/ADD_ANNOTATION_TYPE`,

  // Filters actions
  SET_ANNOTATION_TYPE_FILTER = `${moduleName}/SET_ANNOTATION_TYPE_FILTER`,
  SET_START_FRAME_FILTER = `${moduleName}/SET_START_FRAME_FILTER`,
  SET_END_FRAME_FILTER = `${moduleName}/SET_END_FRAME_FILTER`,

  // Import actions
  SET_IMPORT_JSON = `${moduleName}/SET_IMPORT_JSON`,
  SET_IMPORT_FILE_METADATA = `${moduleName}/SET_IMPORT_FILE_METADATA`,
  SET_IMPORT_FILE_TYPE = `${moduleName}/SET_IMPORT_FILE_TYPE`,
  SET_IMPORT_FILE_MAP = `${moduleName}/SET_IMPORT_FILE_MAP`,
  POPULATE_FROM_IMPORT = `${moduleName}/POPULATE_FROM_IMPORT`,

  // Backend
  POPULATE_FROM_BACKEND = `${moduleName}/POPULATE_FROM_BACKEND`,

  // Reset state
  RESET_STATE = `${moduleName}/RESET_STATE`,
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

export const setStartFrameFilterAction = createAction<{
  frame: number | null;
}>(E_ANNOTATION_ACTIONS.SET_START_FRAME_FILTER);

export const setEndFrameFilterAction = createAction<{
  frame: number | null;
}>(E_ANNOTATION_ACTIONS.SET_END_FRAME_FILTER);

export const setImportJSONAction = createAction<
  Array<Array<Record<string, any>>> | Array<Record<string, any>> | null
>(E_ANNOTATION_ACTIONS.SET_IMPORT_JSON);

export const setImportFileMetadataAction = createAction<{
  name: string;
  size: number;
  type: string;
} | null>(E_ANNOTATION_ACTIONS.SET_IMPORT_FILE_METADATA);

export const setImportFileTypeAction =
  createAction<E_IMPORT_ANNOTATIONS_FILE_TYPE | null>(
    E_ANNOTATION_ACTIONS.SET_IMPORT_FILE_TYPE,
  );

export const setImportFileMapAction = createAction<
  Partial<Record<DotNestedKeys<TAnnotation>, string>>
>(E_ANNOTATION_ACTIONS.SET_IMPORT_FILE_MAP);

export const populateFromImportAction = createAction<Array<Array<TAnnotation>>>(
  E_ANNOTATION_ACTIONS.POPULATE_FROM_IMPORT,
);

export const populateFromBackend = createAction<Array<Array<TAnnotation>>>(
  E_ANNOTATION_ACTIONS.POPULATE_FROM_BACKEND,
);

export const resetAnnotationsState = createAction(
  E_ANNOTATION_ACTIONS.RESET_STATE,
);
