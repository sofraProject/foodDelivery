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
export const signUpUser = createAsyncThunk<UserResponse, FormData>(
  "auth/signUpUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post<UserResponse>(
        `${serverDomain}/api/auth/signup`,
        formData, 
        {
          headers: {
            // Let the browser handle the content-type with FormData
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserLocation = createAsyncThunk(
  "auth/updateUserLocation",
  async (location: [number, number], { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${serverDomain}/api/users/location`, 
        { location }
      );
      return response.data; // Retourne les données si la requête est réussie
    } catch (error) {
      return rejectWithValue((error as Error).message); // Gère l'erreur
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
      .addCase(updateUserLocation.pending, (state) => {
        state.status = "loading"; // Commence à charger
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        state.status = "succeeded"; // Succès de la mise à jour
        state.user = { ...state.user, location: action.payload.location }; 
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.status = "failed"; 
        state.error = action.payload as string; 
      });
  },
});

export default authSlice.reducer;
