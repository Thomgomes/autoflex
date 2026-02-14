import { configureStore } from '@reduxjs/toolkit';
import productionReducer from './slices/productionSlice.ts';

export const store = configureStore({
  reducer: {
    production: productionReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;