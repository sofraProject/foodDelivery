import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItem } from "../../types/cartTypes";

// Utilisation de la variable d'environnement pour le domaine du serveur
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Thunk pour récupérer les éléments du panier, soit depuis sessionStorage soit depuis l'API
export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    const savedItems = sessionStorage.getItem("cartItems");

    if (savedItems) {
      return JSON.parse(savedItems);
    }

    try {
      const response = await axios.get(`${serverDomain}/api/carts/withid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data || (error as Error).message
      );
    }
  }
);

// Thunk pour ajouter un élément au panier
// Thunk pour ajouter un élément au panier
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (item: CartItem, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverDomain}/api/carts`,
        {
          restaurant_owner_id: item.user_id, // Assurez-vous que c'est le bon ID
          menu_item_id: item.id, // Corrigez de `menuitems_id` à `menu_item_id` si nécessaire
          quantity: item.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data || (error as Error).message
      );
    }
  }
);

// Thunk pour supprimer un élément du panier
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${serverDomain}/api/carts/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data || (error as Error).message
      );
    }
  }
);

// Thunk pour mettre à jour la quantité d'un élément du panier
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async (
    { id, quantity }: { id: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${serverDomain}/api/carts/update/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data || (error as Error).message
      );
    }
  }
);

// Thunk pour vider le panier
export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${serverDomain}/api/carts/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return null;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data || (error as Error).message
      );
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("cartItems"); // Vide également sessionStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        sessionStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const newItem = action.payload.MenuItem;
        const existingItem = state.items.find((item) => item.id === newItem.id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
        sessionStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        sessionStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const item = state.items.find(
          (item) => item.id === action.payload.MenuItem.id
        );
        if (item) {
          item.quantity = action.payload.quantity;
        }
        sessionStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        sessionStorage.removeItem("cartItems");
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
