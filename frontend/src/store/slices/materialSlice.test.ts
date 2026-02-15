import materialReducer, { addMaterial, deleteMaterial, fetchMaterials } from './materialSlice';

describe('Material Slice', () => {
  // Define como o estado deve começar, baseado no seu arquivo materialSlice.ts
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('should return the initial state when no action is passed', () => {
    // O reducer é a função que altera o estado. 
    // Aqui testamos se ele retorna o estado inicial corretamente.
    const result = materialReducer(undefined, { type: 'unknown' });
    
    expect(result).toEqual(initialState);
  });

  it('should set loading to true when fetchMaterials is pending', () => {
    // fetchMaterials.pending é a ação que o Redux Toolkit cria automaticamente
    // quando uma busca no banco de dados começa.
    const action = { type: fetchMaterials.pending.type };
    
    const state = materialReducer(initialState, action);
    
    expect(state.loading).toBe(true);
  });

  it('should update items list when fetchMaterials is fulfilled', () => {
    // 1. Criamos um "mock" (simulação) de como os dados chegam da API
    const mockMaterials = [
      { id: 1, name: 'Iron', stockQuantity: 50 },
      { id: 2, name: 'Rubber', stockQuantity: 200 }
    ];

    // 2. Criamos a ação de sucesso (fulfilled) com esses dados como "payload"
    const action = { 
      type: fetchMaterials.fulfilled.type, 
      payload: mockMaterials 
    };
    
    // 3. Executamos o reducer
    const state = materialReducer(initialState, action);
    
    // 4. Verificações (Asserções)
    expect(state.loading).toBe(false); // Carregamento deve parar
    expect(state.items).toHaveLength(2); // Deve ter 2 itens
    expect(state.items).toEqual(mockMaterials); // Devem ser exatamente os dados que simulamos
    expect(state.items[0].name).toBe('Iron'); // O primeiro deve ser o Ferro
  });

  it('should set error message when fetchMaterials is rejected', () => {
    // 1. Criamos a ação de erro (rejected)
    // O Redux Toolkit gera essa ação automaticamente quando a Promise da API falha
    const action = { type: fetchMaterials.rejected.type };
    
    // 2. Executamos o reducer
    const state = materialReducer(initialState, action);
    
    // 3. Verificações
    expect(state.loading).toBe(false); // O carregamento deve parar mesmo em caso de erro
    expect(state.error).toBe('Erro ao carregar materiais'); // A mensagem deve bater com o seu código
    expect(state.items).toHaveLength(0); // A lista deve continuar vazia
  });

  // ... testes anteriores ...

  it('should add a new material to the list when addMaterial is fulfilled', () => {
    // 1. Criamos um novo material (o que a API devolveria após o cadastro)
    const newMaterial = { id: 3, name: 'Plastic', stockQuantity: 300 };

    // 2. Criamos a ação de sucesso do cadastro
    const action = { 
      type: addMaterial.fulfilled.type, 
      payload: newMaterial 
    };
    
    // 3. Executamos o reducer
    const state = materialReducer(initialState, action);
    
    // 4. Verificamos se o item foi parar à lista
    expect(state.items).toContainEqual(newMaterial);
    expect(state.items).toHaveLength(1);
  });

  it('should remove a material from the list when deleteMaterial is fulfilled', () => {
    // 1. Criamos um estado que já tem um item para podermos remover
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: 'Iron', stockQuantity: 50 }]
    };

    // 2. Criamos a ação de sucesso da remoção (enviando apenas o ID 1)
    const action = { 
      type: deleteMaterial.fulfilled.type, 
      payload: 1 
    };
    
    // 3. Executamos o reducer
    const state = materialReducer(stateWithItems, action);
    
    // 4. Verificamos se a lista ficou vazia
    expect(state.items).toHaveLength(0);
    expect(state.items.find(item => item.id === 1)).toBeUndefined();
  });
});