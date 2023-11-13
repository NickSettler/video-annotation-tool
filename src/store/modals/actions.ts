import { createAction } from '@reduxjs/toolkit';
import { E_MODALS, TDynModalMeta } from './reducer';

export enum E_MODAL_ACTIONS {
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
}

export const openModal = createAction(
  E_MODAL_ACTIONS.MODAL_OPEN,
  <M extends E_MODALS>(modal: M, meta: TDynModalMeta<M>) => ({
    payload: {
      modal: modal,
      meta: meta,
    },
  }),
);

export const closeModal = createAction<{
  modal: E_MODALS;
}>(E_MODAL_ACTIONS.MODAL_CLOSE);
