import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Order } from '../../types/orderTypes'; // Import the correct Order type

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN; // Correct the typo in variable name

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk<Order[]>('orders/fetchOrders', async () => {
  const response = await axios.get(`${serverDomain}/api/orders/`);
  console.log("orders=================>",response.data)
  return response.data; // Ensure the API returns data that matches the Order type
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Ensure payload matches Order[]
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export default orderSlice.reducer;