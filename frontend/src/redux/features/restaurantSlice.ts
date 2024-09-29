// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

// // Async thunk to fetch restaurants
// export const fetchRestaurants = createAsyncThunk(
//   'restaurants/fetchRestaurants',
//   async () => {
//     const response = await axios.get(`${serverDomain}/api/users/owner/restaurants`);
//     return response.data;
//   }
// );

// const restaurantSlice = createSlice({
//   name: 'restaurants',
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRestaurants.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchRestaurants.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchRestaurants.rejected, (state, action) => {
//         state.loading = false;
//         // state.error = action.error.message||null;
//       });
//   },
// });

// export default restaurantSlice.reducer;
