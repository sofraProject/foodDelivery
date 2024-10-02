import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

export const searchProductsAndRestaurants = createAsyncThunk(
  "search/productsAndRestaurants",
  async ({ searchTerm, lat, long }: { searchTerm: string; lat: number; long: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${serverDomain}/api/search?q=${encodeURIComponent(searchTerm)}&lat=${lat}&long=${long}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

interface SearchState {
  results: {
    menuItems: Array<{
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
      User?: {
        name: string;
      };
    }>;
    restaurants: Array<{
      id: number;
      name: string;
      email: string;
      imagesUrl?: string;
      location?: {
        coordinates: [number, number];
      };
    }>;
  };
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: {
    menuItems: [],
    restaurants: [],
  },
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProductsAndRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsAndRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchProductsAndRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default searchSlice.reducer;
