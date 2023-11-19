import { createReducer } from '@reduxjs/toolkit';
import { closeModal, openModal } from './actions';
import { findLastIndex } from 'lodash';

export enum E_MODALS {
  PROJECT_SETTINGS = 'project-settings.modal',
  JUMP_TO_FRAME = 'jump-to-frame.modal',
}

export type TModalMapItem = {
  id: E_MODALS;
  open: boolean;
  meta?: any;
};

export type TModalMetaMap = {
  [E_MODALS.PROJECT_SETTINGS]: {
    //
  };
  [E_MODALS.JUMP_TO_FRAME]: {
    onSuccess(frame: number): void;
  };
};

export type TModalState = {
  modals: Array<TModalMapItem>;
};

export type TDynModalMeta<Modal extends E_MODALS> = TModalMetaMap[Modal];

const initialState: TModalState = {
  modals: [],
};

export const modalsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(openModal, (state, { payload: { modal, meta } }) => {
      return {
        ...state,
        modals: [
          ...state.modals,
          {
            id: modal,
            open: true,
            meta,
          },
        ],
      };
    })
    .addCase(closeModal, (state, { payload: { modal } }) => {
      const lastModalIndex = findLastIndex(state.modals, { id: modal });

      return {
        ...state,
        modals: [
          ...state.modals.slice(0, lastModalIndex),
          ...state.modals.slice(lastModalIndex + 1),
        ],
      };
    }),
);
