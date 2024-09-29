import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  LoginCredentials,
  SignUpCredentials,
  User,
  UserResponse,
} from "../../types/userTypes";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,

};

// Logout action
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Optionally, add API logic for logout here
});

// Login action
export const loginUser = createAsyncThunk<UserResponse, LoginCredentials>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<UserResponse>(
        `${serverDomain}/api/auth/signin`,
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Sign-up action
export const signUpUser = createAsyncThunk<UserResponse, SignUpCredentials>(
  "auth/signUpUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<UserResponse>(
        `${serverDomain}/api/auth/signup`,
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update user location action
export const updateUserLocation = createAsyncThunk<
  UserResponse,
  [number, number] // [longitude, latitude]
>(
  "auth/updateUserLocation",
  async ([longitude, latitude], { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const response = await axios.patch<UserResponse>(
        `${serverDomain}/api/users/${userId}/location`,
        { longitude, latitude }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Sign-up
      .addCase(signUpUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Update user location
      .addCase(updateUserLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user) {
          state.user.location = action.payload.user.location; // Assuming location is part of the user response
        }
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
