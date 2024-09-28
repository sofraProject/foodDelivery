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
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {});

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
export const updateUserLocation = createAsyncThunk<UserResponse, { id: string; location: number[] }>(
  "auth/updateUserLocation",
  async ({ id, location }, { rejectWithValue }) => {
    try {
      const response = await axios.put<UserResponse>(
        `${serverDomain}/api/user/location`, // Adjust the endpoint as necessary
        { location },
        { headers: { Authorization: `Bearer ${id}` } } // Include token if needed
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        const payload = action.payload as UserResponse; // Type assertion for correct structure
      
        if (state.user) {
          state.user = {
            ...state.user, // Preserve other user properties
            location: payload.user.location, // Assuming the updated location is inside `payload.user.location`
          };
        }
      });
  },
});

export default authSlice.reducer;
