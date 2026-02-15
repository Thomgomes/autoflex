import productReducer, {
  fetchProducts,
  addProduct,
  deleteProduct,
} from "./productSlice";

describe("Product Slice", () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(productReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should handle fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it("should handle fetchProducts.fulfilled", () => {
    const mockProducts = [{ id: 1, name: "Cake", price: 50 }];
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    };
    const state = productReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockProducts);
  });

  it("should handle addProduct.fulfilled", () => {
    const newProduct = { id: 2, name: "Cookie", price: 10 };
    const action = { type: addProduct.fulfilled.type, payload: newProduct };
    const state = productReducer(initialState, action);

    expect(state.items).toContainEqual(newProduct);
    expect(state.items).toHaveLength(1);
  });

  it("should handle deleteProduct.fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: "Cake", price: 50 }],
    };
    const action = { type: deleteProduct.fulfilled.type, payload: 1 };
    const state = productReducer(stateWithItems, action);

    expect(state.items).toHaveLength(0);
  });
});
