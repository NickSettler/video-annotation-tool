import { TAnnotationState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import { setFrameAnnotationAction } from './actions';

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
        },
      },
    ],
  ],
};

export const annotationReducer = createReducer(initialState, (builder) =>
  builder.addCase(
    setFrameAnnotationAction,
    (state, { payload: { annotation, frame } }) => ({
      ...state,
      annotations: state.annotations.map((frameAnnotations, index) =>
        index === frame ? [annotation] : frameAnnotations,
      ),
    }),
  ),
);
