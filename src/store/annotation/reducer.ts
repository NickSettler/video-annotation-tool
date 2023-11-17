import { TAnnotationState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  addFrameAnnotationAction,
  setAllAnnotationsAction,
  setFrameAnnotationAction,
  setFrameAnnotationsAction,
} from './actions';

const initialState: TAnnotationState = {
  annotations: [
    [
      {
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'MultiPoint',
          coordinates: [
            [120, 120],
            [180, 120],
            [180, 224],
            [120, 224],
          ],
        },
        properties: {
          name: 'test',
          color: 'red',
        },
      },
    ],
    [
      {
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'MultiPoint',
          coordinates: [
            [170, 170],
            [220, 170],
            [220, 264],
            [170, 264],
          ],
        },
        properties: {
          name: 'test',
          color: 'red',
        },
      },
    ],
  ],
};

export const annotationReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setAllAnnotationsAction, (state, { payload: annotations }) => ({
      ...state,
      annotations,
    }))
    .addCase(
      setFrameAnnotationAction,
      (state, { payload: { annotation, frame } }) => ({
        ...state,
        annotations: state.annotations.map((frameAnnotations, index) =>
          index === frame ? [annotation] : frameAnnotations,
        ),
      }),
    )
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
          [...(state.annotations[frame] ?? []), annotation],
          ...state.annotations.slice(frame + 1),
        ],
      }),
    ),
);
