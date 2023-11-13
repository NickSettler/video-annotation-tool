import { createSelector } from '@reduxjs/toolkit';
import { E_MODALS } from './reducer';
import { find } from 'lodash';
import { TAppState } from '../store';

export const modalsListSelector = createSelector(
  (state: TAppState) => state.modals,
  (modals) => modals.modals,
);

export const isModalOpenSelector = (id: E_MODALS) =>
  createSelector(
    (state: TAppState) => find(state.modals.modals, { id }),
    (modal) => modal?.open ?? false,
  );

export const modalMetaSelector = (id: E_MODALS) =>
  createSelector(
    (state: TAppState) => find(state.modals.modals, { id }),
    (modal) => modal?.meta ?? {},
  );
