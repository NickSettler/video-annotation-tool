import { TAnnotationState, TAnnotationType } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  addAnnotationTypeAction,
  addFrameAnnotationAction,
  clearSelectionAction,
  groupSelectionAction,
  initAnnotationsAction,
  populateFromImportAction,
  resetAnnotationsState,
  setAllAnnotationsAction,
  setAnnotationTypeFilterAction,
  setAnnotationTypesAction,
  setEndFrameFilterAction,
  setFrameAnnotationsAction,
  setImportFileMapAction,
  setImportFileMetadataAction,
  setImportFileTypeAction,
  setImportJSONAction,
  setStartFrameFilterAction,
  toggleSelectionItemAction,
  updateFramePolygonAction,
  updatePolygonAction,
} from './actions';
import {
  constant,
  filter,
  find,
  flattenDepth,
  isEqual,
  map,
  merge,
  some,
  times,
  uniqBy,
  xorWith,
} from 'lodash';
import { isAnnotationSelectionGroupable } from '../../utils/annotation/group';

const initialState: TAnnotationState = {
  annotations: [],
  selection: [],
  types: [],
  typeFilter: null,
  startFrameFilter: null,
  endFrameFilter: null,
  importJSON: null,
  importFileMetadata: null,
  importFileType: null,
  importFileMap: {},
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
    // Filters
    .addCase(setAnnotationTypeFilterAction, (state, { payload: { type } }) => ({
      ...state,
      typeFilter: type,
    }))
    .addCase(setStartFrameFilterAction, (state, { payload: { frame } }) => ({
      ...state,
      startFrameFilter: frame,
    }))
    .addCase(setEndFrameFilterAction, (state, { payload: { frame } }) => ({
      ...state,
      endFrameFilter: frame,
    }))
    // Import
    .addCase(setImportJSONAction, (state, { payload: importJSON }) => ({
      ...state,
      importJSON,
    }))
    .addCase(
      setImportFileMetadataAction,
      (state, { payload: importFileMetadata }) => ({
        ...state,
        importFileMetadata,
      }),
    )
    .addCase(setImportFileTypeAction, (state, { payload: importFileType }) => ({
      ...state,
      importFileType,
    }))
    .addCase(setImportFileMapAction, (state, { payload: importFileMap }) => ({
      ...state,
      importFileMap,
    }))
    .addCase(populateFromImportAction, (state, { payload }) => {
      const types: Array<TAnnotationType> = uniqBy(
        filter(
          map(flattenDepth(payload, 1), (annotation): TAnnotationType | null =>
            annotation?.properties?.type
              ? {
                  type: annotation.properties.type,
                  color: annotation.properties.color,
                }
              : null,
          ),
          (type): type is TAnnotationType => !!type,
        ),
        'type',
      );

      const annotations = times(state.annotations.length, constant([])).map(
        (frameAnnotations, index) => {
          return payload[index]?.length > 0 ? payload[index] : frameAnnotations;
        },
      );

      return {
        ...state,
        annotations,
        types,
      };
    }),
    })
    .addCase(resetAnnotationsState, () => initialState),
);
