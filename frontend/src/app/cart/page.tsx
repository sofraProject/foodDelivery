"use client";

import axios from "axios";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import swal from "sweetalert";
import {
  removeFromCartAsync,
  updateQuantityAsync,
} from "../../redux/features/cartSlice";
import { AppDispatch, RootState } from "../../redux/store";
import Back from "../back/page";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCartAsync(id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantityAsync({ id, quantity: newQuantity }));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/api/orders/create",
        {
          items: cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const paymentResponse = await axios.post(
        "http://localhost:3000/api/payment/generatePayment",
        {
          amount: Math.round(totalPrice),
          developerTrackingId: `order_${Math.random()}`,
          orderId: orderResponse.data.order.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (paymentResponse.data.result && paymentResponse.data.result.link) {
        window.open(paymentResponse.data.result.link, "_blank");
      }

      const { order, delivery } = orderResponse.data;

      if (delivery) {
        swal(
          "Congratulations!!!",
          `Your order has been placed successfully. Order ID: ${order.id}\nDriver: ${delivery.driver.name}\nDriver Phone: ${delivery.driver.email}`,
          "success"
        );
      } else {
        swal(
          "Order Placed",
          `Your order has been placed successfully. Order ID: ${order.id}\nNo driver is currently available. Please check back later.`,
          "success"
        );
        router.push("/orders"); // Assuming you have an orders page to view order history
      }
    } catch (error) {
      console.error("Error placing order:", error);
      swal("Error", "Failed to place order. Please try again.", "error");
    }
  };

  const subTotal = parseFloat(totalPrice.toFixed(2));
  const tax = parseFloat((totalPrice * 0.05).toFixed(2));
  const deliveryFee = parseFloat((totalPrice * 0.1).toFixed(2));
  const total = parseFloat((subTotal + tax + deliveryFee).toFixed(2));
  console.log(cartItems);


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
              {/* left side - cart items */}
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
                          {Number(item.price).toFixed(2)} TND
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
              {/* right side - order summary */}
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
                    <p className="text-gray-700 poppins">
                      Estimated Delivery Time:{" "}
                      <span className="font-semibold text-black">
                        20-30 min
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col my-4 space-y-3">
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Subtotal
                      </span>
                      <span className="font-semibold text-black poppins">
                        ${subTotal}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Tax
                      </span>
                      <span className="font-semibold text-black poppins">
                        ${tax}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-gray-700 poppins">
                        Delivery Fee
                      </span>
                      <span className="font-semibold text-black poppins">
                        ${deliveryFee}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-grow text-xl text-gray-700 poppins">
                        Total
                      </span>
                      <span className="text-xl font-semibold text-black poppins">
                        ${total}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full px-6 py-3 text-white transition duration-500 rounded-lg bg-primary poppins ring-red-300 focus:ring-4"
                    >
                      Place Order
                    </button>
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

