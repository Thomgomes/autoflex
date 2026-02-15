import materialReducer, {
  addMaterial,
  deleteMaterial,
  fetchMaterials,
} from "./materialSlice";

describe("Material Slice", () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it("should return the initial state when no action is passed", () => {
    const result = materialReducer(undefined, { type: "unknown" });

    expect(result).toEqual(initialState);
  });

  it("should set loading to true when fetchMaterials is pending", () => {
    const action = { type: fetchMaterials.pending.type };

    const state = materialReducer(initialState, action);

    expect(state.loading).toBe(true);
  });

  it("should update items list when fetchMaterials is fulfilled", () => {
    const mockMaterials = [
      { id: 1, name: "Iron", stockQuantity: 50 },
      { id: 2, name: "Rubber", stockQuantity: 200 },
    ];

    const action = {
      type: fetchMaterials.fulfilled.type,
      payload: mockMaterials,
    };

    const state = materialReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items).toEqual(mockMaterials);
    expect(state.items[0].name).toBe("Iron");
  });

  it("should set error message when fetchMaterials is rejected", () => {
    const action = { type: fetchMaterials.rejected.type };

    const state = materialReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Erro ao carregar materiais");
    expect(state.items).toHaveLength(0);
  });

  it("should add a new material to the list when addMaterial is fulfilled", () => {
    const newMaterial = { id: 3, name: "Plastic", stockQuantity: 300 };

    const action = {
      type: addMaterial.fulfilled.type,
      payload: newMaterial,
    };

    const state = materialReducer(initialState, action);

    expect(state.items).toContainEqual(newMaterial);
    expect(state.items).toHaveLength(1);
  });

  it("should remove a material from the list when deleteMaterial is fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: "Iron", stockQuantity: 50 }],
    };

    const action = {
      type: deleteMaterial.fulfilled.type,
      payload: 1,
    };

    const state = materialReducer(stateWithItems, action);

    expect(state.items).toHaveLength(0);
    expect(state.items.find((item) => item.id === 1)).toBeUndefined();
  });
});
