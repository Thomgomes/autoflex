import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { Product } from "@/types";

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (newProduct: Omit<Product, "id">) => {
    const response = await api.post<Product>("/products", newProduct);
    return response.data;
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product: Product) => {
    const response = await api.put<Product>(`/products/${product.id}`, product);
    return response.data;
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
