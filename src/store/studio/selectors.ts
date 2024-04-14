import { TAppState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { moduleName } from './actions';
import { TStudioState } from './types';

const studioState = (state: TAppState): TStudioState => state[moduleName];

export const studioProjectSelector = createSelector(
  studioState,
  (studio) => studio.project,
);

export const studioSaveInProgress = createSelector(
  studioState,
  (studio) => studio.annotationsSaveInProgress,
);
