import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { videoReducer, moduleName as videoModuleName } from './video';
import {
  annotationReducer,
  moduleName as annotationModuleName,
} from './annotation';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: combineReducers({
    [videoModuleName]: videoReducer,
    [annotationModuleName]: annotationReducer,
  }),
});

export type TAppState = ReturnType<typeof store.getState>;

export type TDispatch = typeof store.dispatch;

export const useAppDispatch: () => TDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector;
