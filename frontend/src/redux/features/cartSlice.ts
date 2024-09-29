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
    // Action pour charger les éléments du panier depuis localStorage
    getCartItems: (state) => {
      const savedItems = localStorage.getItem("cartItems");

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
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // Action pour mettre à jour la quantité d'un élément
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // Action pour supprimer un élément du panier
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // Action pour vider le panier
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },

    // Nouvelle action pour supprimer tous les éléments associés à un restaurantId spécifique
    removeItemsByRestaurantId: (state, action) => {
      const restaurantId = action.payload;
      state.items = state.items.filter(
        (item) => item.restaurantId !== restaurantId
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },
});

export const {
  getCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  removeItemsByRestaurantId, // Export de la nouvelle action
} = cartSlice.actions;

export default cartSlice.reducer;
