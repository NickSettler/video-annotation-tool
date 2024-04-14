import { TStudioState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  resetStudioState,
  setSaveInProgress,
  setStudioProject,
} from './actions';

const initialState: TStudioState = {
  project: null,
  annotationsSaveInProgress: false,
};

export const studioReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setStudioProject, (state, { payload: project }) => ({
      ...state,
      project,
    }))
    .addCase(
      setSaveInProgress,
      (state, { payload: annotationsSaveInProgress }) => ({
        ...state,
        annotationsSaveInProgress,
      }),
    )
    .addCase(resetStudioState, () => initialState);
});
