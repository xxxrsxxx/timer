import { createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Define a type for the slice state
interface MainState {
  active: boolean;
  value: string;
}

// Define the initial state using that type
const initialState: MainState = {
  active: false,
  value: "",
};

export const mainSlice = createSlice({
  name: "main",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getToolTip: (state, action) => {
      const { active, value } = action.payload;
      state.active = active;
      state.value = value;
    },
  },
});

export const { getToolTip } = mainSlice.actions;

export function useHookMain() {
  // The `state` arg is correctly typed as `RootState` already
  const mainState = useAppSelector((state: RootState) => state.commerce.Main);
  const dispatch = useAppDispatch();

  return {
    mainState,
    dispatch,
  };
}

export default mainSlice.reducer;
