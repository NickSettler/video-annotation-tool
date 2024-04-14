import { createAction } from '@reduxjs/toolkit';
import { TProject } from '../../api/projects/types';

export const moduleName = 'studio';

export enum E_STUDIO_ACTIONS {
  SET_STUDIO_PROJECT = `${moduleName}/SET_STUDIO_PROJECT`,
  SET_SAVE_IN_PROGRESS = `${moduleName}/SET_SAVE_IN_PROGRESS`,

  RESET_STATE = `${moduleName}/RESET_STATE`,
}

export const setStudioProject = createAction<TProject | null>(
  E_STUDIO_ACTIONS.SET_STUDIO_PROJECT,
);

export const setSaveInProgress = createAction<boolean>(
  E_STUDIO_ACTIONS.SET_SAVE_IN_PROGRESS,
);

export const resetStudioState = createAction(E_STUDIO_ACTIONS.RESET_STATE);
