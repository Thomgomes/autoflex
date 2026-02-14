import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { ProductionResponse } from '@/types';

interface ProductionState extends ProductionResponse {
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  suggestions: [],
  totalValue: 0,
  loading: false,
  error: null,
};

// Thunk para chamar o endpoint RF004 do Backend
export const fetchProductionSuggestion = createAsyncThunk(
  'production/fetchSuggestion',
  async () => {
    const response = await api.get<ProductionResponse>('/production/suggestion');
    return response.data;
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductionSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload.suggestions;
        state.totalValue = action.payload.totalValue;
      })
      .addCase(fetchProductionSuggestion.rejected, (state) => {
        state.loading = false;
        state.error = 'Falha ao carregar sugestões de produção';
      });
  },
});

export default productionSlice.reducer;