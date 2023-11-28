import { TAnnotationState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  addFrameAnnotationAction,
  clearSelectionAction,
  groupSelectionAction,
  initAnnotationsAction,
  setAllAnnotationsAction,
  setFrameAnnotationsAction,
  toggleSelectionItemAction,
  updateFramePolygonAction,
} from './actions';
import {
  assign,
  constant,
  find,
  flattenDepth,
  isEqual,
  some,
  times,
  xorWith,
} from 'lodash';
import { isAnnotationSelectionGroupable } from '../../utils/annotation/group';

const initialState: TAnnotationState = {
  annotations: [],
  selection: [],
  types: [],
};

export const annotationReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(initAnnotationsAction, (state, { payload: { count } }) => ({
      ...state,
      annotations: times(count, constant([])),
    }))
    .addCase(setAllAnnotationsAction, (state, { payload: annotations }) => ({
      ...state,
      annotations,
    }))
    .addCase(
      setFrameAnnotationsAction,
      (state, { payload: { annotations, frame } }) => ({
        ...state,
        annotations: state.annotations.map((frameAnnotations, index) =>
          index === frame ? annotations : frameAnnotations,
        ),
      }),
    )
    .addCase(
      addFrameAnnotationAction,
      (state, { payload: { annotation, frame } }) => ({
        ...state,
        annotations: [
          ...state.annotations.slice(0, frame),
          [...state.annotations[frame], annotation],
          ...state.annotations.slice(frame + 1),
        ],
      }),
    )
    .addCase(
      updateFramePolygonAction,
      (state, { payload: { frame, polygonID, payload } }) => ({
        ...state,
        annotations: [
          ...state.annotations.slice(0, frame),
          state.annotations[frame].map((polygon) =>
            polygon.id === polygonID ? assign({}, polygon, payload) : polygon,
          ),
        ),
      }),
    ),
);
