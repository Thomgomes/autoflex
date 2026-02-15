import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { ProductMaterial } from "@/types";

interface ProductMaterialState {
  recipeItems: ProductMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductMaterialState = {
  recipeItems: [],
  loading: false,
  error: null,
};

// Busca materiais vinculados a um produto específico
export const fetchRecipeByProduct = createAsyncThunk(
  "productMaterial/fetchByProduct",
  async (productId: number) => {
    const response = await api.get<ProductMaterial[]>(
      `/product-materials/product/${productId}`,
    );
    return response.data;
  },
);

// Adiciona um material à receita
export const addMaterialToRecipe = createAsyncThunk(
  "productMaterial/add",
  async (data: {
    productId: number;
    materialId: number;
    quantityRequired: number;
  }) => {
    const response = await api.post<ProductMaterial>(
      "/product-materials",
      data,
    );
    return response.data;
  },
);

// Remove um material da receita
export const removeMaterialFromRecipe = createAsyncThunk(
  "productMaterial/remove",
  async (id: number) => {
    await api.delete(`/product-materials/${id}`);
    return id;
  },
);

export const updateRecipeQuantity = createAsyncThunk(
  "productMaterial/updateQuantity",
  async ({
    id,
    quantityRequired,
  }: {
    id: number;
    quantityRequired: number;
  }) => {
    const response = await api.put<ProductMaterial>(
      `/product-materials/${id}`,
      { quantityRequired },
    );
    return response.data;
  },
);

const productMaterialSlice = createSlice({
  name: "productMaterial",
  initialState,
  reducers: {
    clearRecipe: (state) => {
      state.recipeItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecipeByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.recipeItems = action.payload;
      })
      .addCase(addMaterialToRecipe.fulfilled, (state, action) => {
        state.recipeItems.push(action.payload);
      })
      .addCase(removeMaterialFromRecipe.fulfilled, (state, action) => {
        state.recipeItems = state.recipeItems.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(updateRecipeQuantity.fulfilled, (state, action) => {
        const index = state.recipeItems.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.recipeItems[index].quantityRequired =
            action.payload.quantityRequired;
        }
      });
  },
});

export const { clearRecipe } = productMaterialSlice.actions;
export default productMaterialSlice.reducer;
