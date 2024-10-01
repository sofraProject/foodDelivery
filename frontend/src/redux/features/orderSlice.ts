import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Order, OrderStatus } from '../../types/orderTypes';

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

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "http://localhost:3100";

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk<Order[]>('orders/fetchOrders', async () => {
  const response = await axios.get(`${serverDomain}/api/orders`);
  console.log("orders=================>", response.data);
  return response.data;
});

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: OrderStatus }
>('orders/updateOrderStatus', async ({ orderId, status }) => {
  const response = await axios.put(`${serverDomain}/api/admin/orders/${orderId}/status`, { status });
  return response.data;
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
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      });
  },
});

export default orderSlice.reducer;