import { configureStore } from "@reduxjs/toolkit";
import productionReducer from "./slices/productionSlice.ts";
import materialReducer from "./slices/materialSlice.ts";

export const store = configureStore({
  reducer: {
    production: productionReducer,
    material: materialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
