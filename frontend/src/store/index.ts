import { configureStore } from "@reduxjs/toolkit";
import productionReducer from "./slices/productionSlice.ts";
import materialReducer from "./slices/materialSlice.ts";
import productReducer from "./slices/productSlice.ts";
import productMaterialReducer from "./slices/productMaterialSlice.ts";

export const store = configureStore({
  reducer: {
    production: productionReducer,
    material: materialReducer,
    product: productReducer,
    productMaterial: productMaterialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
