import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { Material } from "@/types";

interface MaterialState {
  items: Material[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMaterials = createAsyncThunk(
  "material/fetchMaterials",
  async () => {
    const response = await api.get<Material[]>("/materials");
    return response.data;
  },
);

export const addMaterial = createAsyncThunk(
  "material/addMaterial",
  async (newMaterial: Omit<Material, "id">) => {
    const response = await api.post<Material>("/materials", newMaterial);
    return response.data;
  },
);

export const deleteMaterial = createAsyncThunk(
  "material/deleteMaterial",
  async (id: number) => {
    await api.delete(`/materials/${id}`);
    return id;
  },
);

export const updateMaterial = createAsyncThunk(
  "material/updateMaterial",
  async (material: Material) => {
    const response = await api.put<Material>(
      `/materials/${material.id}`,
      material,
    );
    return response.data;
  },
);

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao carregar materiais";
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default materialSlice.reducer;
