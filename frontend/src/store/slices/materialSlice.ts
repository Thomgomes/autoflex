import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { type Material } from '@/types';

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

export const fetchMaterials = createAsyncThunk('material/fetchMaterials', async () => {
  const response = await api.get<Material[]>('/materials');
  return response.data;
});


export const addMaterial = createAsyncThunk(
  'material/addMaterial',
  async (newMaterial: Omit<Material, 'id'>) => {
    const response = await api.post<Material>('/materials', newMaterial);
    return response.data;
  }
);

const materialSlice = createSlice({
  name: 'material',
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
        state.error = 'Erro ao carregar materiais';
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default materialSlice.reducer;