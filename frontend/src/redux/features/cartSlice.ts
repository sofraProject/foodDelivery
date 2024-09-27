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
    // Action pour charger les éléments du panier (peut être supprimée si non nécessaire)
    getCartItems: (state) => {
      // Suppression du code lié à localStorage
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
      // Suppression de l'enregistrement dans localStorage
    },

    // Action pour mettre à jour la quantité d'un élément
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      // Suppression de l'enregistrement dans localStorage
    },

    // Action pour supprimer un élément du panier
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Suppression de l'enregistrement dans localStorage
    },

    // Action pour vider le panier
    clearCart: (state) => {
      state.items = [];
      // Suppression de la suppression dans localStorage
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
