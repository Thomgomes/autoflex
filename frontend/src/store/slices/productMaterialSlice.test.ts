import productMaterialReducer, {
  clearRecipe,
  fetchRecipeByProduct,
  addMaterialToRecipe,
  removeMaterialFromRecipe,
} from "./productMaterialSlice";

describe("Product Material Slice", () => {
  const initialState = {
    recipeItems: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(productMaterialReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should clear recipe items using clearRecipe action", () => {
    const stateWithItems = {
      ...initialState,
      recipeItems: [
        { id: 1, productId: 1, materialId: 10, quantityRequired: 5 },
      ],
    };

    const result = productMaterialReducer(stateWithItems, clearRecipe());

    expect(result.recipeItems).toHaveLength(0);
  });

  it("should handle fetchRecipeByProduct.pending", () => {
    const action = { type: fetchRecipeByProduct.pending.type };
    const state = productMaterialReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it("should handle fetchRecipeByProduct.fulfilled", () => {
    const mockRecipe = [
      { id: 1, productId: 1, materialId: 10, quantityRequired: 5 },
    ];
    const action = {
      type: fetchRecipeByProduct.fulfilled.type,
      payload: mockRecipe,
    };
    const state = productMaterialReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.recipeItems).toEqual(mockRecipe);
  });

  it("should add an item to the recipe when addMaterialToRecipe is fulfilled", () => {
    const newItem = {
      id: 2,
      productId: 1,
      materialId: 20,
      quantityRequired: 2,
    };
    const action = {
      type: addMaterialToRecipe.fulfilled.type,
      payload: newItem,
    };
    const state = productMaterialReducer(initialState, action);

    expect(state.recipeItems).toContainEqual(newItem);
    expect(state.recipeItems).toHaveLength(1);
  });

  it("should remove a material from the recipe when removeMaterialFromRecipe is fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      recipeItems: [
        { id: 1, productId: 1, materialId: 10, quantityRequired: 5 },
        { id: 2, productId: 1, materialId: 20, quantityRequired: 2 },
      ],
    };

    const action = {
      type: removeMaterialFromRecipe.fulfilled.type,
      payload: 1,
    };

    const state = productMaterialReducer(stateWithItems, action);

    expect(state.recipeItems).toHaveLength(1);
    expect(state.recipeItems[0].id).toBe(2);
    expect(state.recipeItems.find((item) => item.id === 1)).toBeUndefined();
  });
});
