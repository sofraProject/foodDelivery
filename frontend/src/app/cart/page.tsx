"use client";

import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { removeFromCart, updateQuantity } from "../../redux/features/cartSlice";
import { AppDispatch, RootState } from "../../redux/store";
import Back from "../back/page";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  console.log("Cart Items:", cartItems); // Debugging des items

  // Calcul du prix total avec fallback sécurisé
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item?.price ? Number(item.price) : 0;
    const quantity = item?.quantity ? Number(item.quantity) : 1; // Assurez-vous d'avoir une valeur par défaut pour quantity
    return total + price * quantity;
  }, 0);

  // Fonction pour supprimer un élément du panier
  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  // Fonction pour mettre à jour la quantité d'un élément
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const subTotal = parseFloat(totalPrice.toFixed(2));
  const tax = parseFloat((totalPrice * 0.05).toFixed(2));
  const deliveryFee = parseFloat((totalPrice * 0.1).toFixed(2));
  const total = parseFloat((subTotal + tax + deliveryFee).toFixed(2));

  return (
    <main className="min-h-screen banner">
      <div className="max-w-screen-xl px-6 py-20 mx-auto">
        <div className="mb-12">
          <Back />
        </div>
        <h2 className="inline-block pb-4 mb-8 text-2xl text-gray-700 border-b-2 border-gray-500 poppins">
          Your Cart
        </h2>
        {cartItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
              {/* Left side - cart items */}
              <div className="col-span-1">
                <div className="flex flex-col pr-4 space-y-4 overflow-y-auto h-96">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex p-4 space-x-3 rounded-lg glass"
                    >
                      <div className="flex">
                        <img
                          className="object-cover w-24 h-24 rounded-lg"
                          src={item.imageUrl}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex flex-col flex-grow space-y-3">
                        <h5 className="text-base text-gray-700 poppins">
                          {item.name}
                        </h5>
                        <h1 className="text-lg font-semibold text-primary poppins">
                          {item.price ? Number(item.price).toFixed(2) : "N/A"}{" "}
                          TND
                        </h1>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded-l"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100 poppins">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <AiOutlineDelete
                          className="w-6 h-6 text-gray-600 transition duration-500 transform cursor-pointer hover:scale-105"
                          onClick={() => handleRemoveItem(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right side - order summary */}
              <div className="col-span-1">
                <div className="box-border p-6 rounded-lg glass">
                  <h2 className="mb-4 text-2xl font-bold poppins">
                    Order Summary
                  </h2>
                  <div className="flex flex-col mb-3 space-y-4">
                    <p className="text-gray-700 poppins">
                      Total Items:{" "}
                      <span className="font-semibold text-black">
                        {cartItems.length}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col my-4 space-y-3">
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Subtotal
                      </span>
                      <span className="font-semibold text-black poppins">
                        {subTotal.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Tax
                      </span>
                      <span className="font-semibold text-black poppins">
                        {tax.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Delivery Fee
                      </span>
                      <span className="font-semibold text-black poppins">
                        {deliveryFee.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-xl text-gray-700 poppins">
                        Total
                      </span>
                      <span className="text-xl font-semibold text-black poppins">
                        {total.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pt-24">
            <h1 className="text-5xl text-center text-primary poppins">
              Your cart is empty!
            </h1>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
