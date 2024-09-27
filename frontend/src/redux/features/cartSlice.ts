import { createSlice } from "@reduxjs/toolkit";
import { CartItem } from "../../types/cartTypes";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Créez la slice pour gérer les éléments du panier
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action pour charger les éléments du panier depuis sessionStorage
    getCartItems: (state) => {
      const savedItems = sessionStorage.getItem("cartItems");
      console.log(savedItems, "chekkkkkkkkk");
      if (savedItems) {
        state.items = JSON.parse(savedItems);
      }
    },

    // Action pour ajouter un élément au panier
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      sessionStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // Action pour mettre à jour la quantité d'un élément
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        sessionStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // Action pour supprimer un élément du panier
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      sessionStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // Action pour vider le panier
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("cartItems");
    },
  },
});

export const {
  getCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
