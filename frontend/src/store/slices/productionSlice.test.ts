import productionReducer, { 
  fetchProductionSuggestion 
} from './productionSlice';

describe('Production Slice', () => {
  // Ajustado para bater exatamente com o initialState do seu productionSlice.ts
  const initialState = {
    suggestions: [],
    totalValue: 0,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(productionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchProductionSuggestion.pending', () => {
    const action = { type: fetchProductionSuggestion.pending.type };
    const state = productionReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('should handle fetchProductionSuggestion.fulfilled', () => {
    const mockData = {
      totalValue: 500,
      suggestions: [{ productName: 'Table', quantityToProduce: 5, subtotal: 500 }]
    };
    
    const action = { 
      type: fetchProductionSuggestion.fulfilled.type, 
      payload: mockData 
    };
    
    const state = productionReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    // Verificamos os campos exatos que você definiu no seu slice
    expect(state.suggestions).toEqual(mockData.suggestions);
    expect(state.totalValue).toBe(500);
  });

  it('should handle fetchProductionSuggestion.rejected', () => {
    const action = { type: fetchProductionSuggestion.rejected.type };
    const state = productionReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Falha ao carregar sugestões de produção');
  });
});