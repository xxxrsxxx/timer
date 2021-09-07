import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducers } from "./commerce";
const commerceRoot = combineReducers(reducers);

export const store = configureStore({
  reducer: { commerce: commerceRoot },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
