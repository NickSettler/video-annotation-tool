import { TAnnotationState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  addFrameAnnotationAction,
  initAnnotationsAction,
  setAllAnnotationsAction,
  setFrameAnnotationsAction,
  updateFramePolygonAction,
} from './actions';
import { assign, constant, times } from 'lodash';

const initialState: TAnnotationState = {
  annotations: [],
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
      (state, { payload: { frame, polygonID, payload } }) => {
        const filtered = state.annotations[frame].filter(
          (polygon) => polygon.id !== polygonID,
        );

        const updated = assign(
          {},
          state.annotations[frame].find((polygon) => polygon.id === polygonID),
          payload,
        );

        return {
          ...state,
          annotations: [
            ...state.annotations.slice(0, frame),
            [...filtered, updated],
            ...state.annotations.slice(frame + 1),
          ],
        };
      },
    ),
);
