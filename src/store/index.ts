import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducers } from "./commerce";
const commerceRoot = combineReducers(reducers);

const _env = process.env.NODE_ENV !== "production";
export const store = configureStore({
  reducer: { commerce: commerceRoot },
  devTools: _env,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
