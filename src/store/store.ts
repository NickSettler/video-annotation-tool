import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { videoReducer } from './video';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: combineReducers({
    video: videoReducer,
  }),
});

export type TAppState = ReturnType<typeof store.getState>;

export type TDispatch = typeof store.dispatch;

export const useAppDispatch: () => TDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector;
