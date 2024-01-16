import { TAnnotationState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  addAnnotationTypeAction,
  addFrameAnnotationAction,
  clearSelectionAction,
  groupSelectionAction,
  initAnnotationsAction,
  setAllAnnotationsAction,
  setAnnotationTypeFilterAction,
  setAnnotationTypesAction,
  setFrameAnnotationsAction,
  toggleSelectionItemAction,
  updateFramePolygonAction,
  updatePolygonAction,
} from './actions';
import {
  constant,
  find,
  flattenDepth,
  isEqual,
  merge,
  some,
  times,
  xorWith,
} from 'lodash';
import { isAnnotationSelectionGroupable } from '../../utils/annotation/group';

const initialState: TAnnotationState = {
  annotations: [],
  selection: [],
  types: [],
  typeFilter: null,
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
            polygon.id === polygonID
              ? merge(JSON.parse(JSON.stringify(polygon)), payload)
              : polygon,
          ),
          ...state.annotations.slice(frame + 1),
        ],
      }),
    )
    .addCase(
      updatePolygonAction,
      (state, { payload: { polygonID, payload } }) => ({
        ...state,
        annotations: state.annotations.map((frameAnnotations) =>
          frameAnnotations.map((polygon) =>
            polygon.id === polygonID
              ? merge(JSON.parse(JSON.stringify(polygon)), payload)
              : polygon,
          ),
        ),
      }),
    )
    .addCase(
      toggleSelectionItemAction,
      (state, { payload: { id, frame } }) => ({
        ...state,
        selection: xorWith(state.selection, [{ id, frame }], isEqual),
      }),
    )
    .addCase(groupSelectionAction, (state) => {
      if (
        !isAnnotationSelectionGroupable(
          flattenDepth(state.annotations, 1),
          state.selection,
        )
      )
        return state;

      const firstSelection = find(flattenDepth(state.annotations, 1), {
        id: state.selection[0].id,
      });

      if (!firstSelection) return state;

      return {
        ...state,
        selection: [],
        annotations: state.annotations.map((frameAnnotations, index) =>
          frameAnnotations.map((polygon) =>
            some(state.selection, { id: polygon.id, frame: index })
              ? {
                  ...polygon,
                  id: firstSelection.id,
                  properties: {
                    ...firstSelection.properties,
                    frame: polygon.properties.frame,
                  },
                }
              : polygon,
          ),
        ),
      };
    })
    .addCase(clearSelectionAction, (state) => ({
      ...state,
      selection: [],
    }))
    .addCase(setAnnotationTypesAction, (state, { payload: { types } }) => ({
      ...state,
      types: types,
      annotations: state.annotations.map((frameAnnotations) =>
        frameAnnotations.map((polygon) => {
          const polygonType = types.find(
            (_type) => _type.type === polygon.properties.type,
          );

          return {
            ...polygon,
            properties: {
              ...polygon.properties,
              color: polygonType
                ? polygonType?.color
                : polygon.properties.color,
            },
          };
        }),
      ),
    }))
    .addCase(addAnnotationTypeAction, (state, { payload: { type } }) => ({
      ...state,
      types: [...state.types, type],
    }))
    .addCase(setAnnotationTypeFilterAction, (state, { payload: { type } }) => ({
      ...state,
      typeFilter: type,
    })),
);
