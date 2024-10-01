"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { handlePayment } from "../../api/payment";
import preview from "../../assets/preview.svg";
import Button from "../../components/Form/Button";
import { removeFromCart, updateQuantity } from "../../redux/features/cartSlice";
import { AppDispatch, RootState } from "../../redux/store";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;
const deliveryFee = 5; // Fixed delivery fee per restaurant

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // Tracking loading status and errors for each restaurant by their ID
  const [loadingStatus, setLoadingStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [orderError, setOrderError] = useState<{
    [key: number]: string | null;
  }>({});
  const [restaurantInfos, setRestaurantInfos] = useState<any[]>([]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  // Redirect to /joinus if not logged in
  useEffect(() => {
    if (!token) {
      swal({
        title: "Please log in",
        text: "You need to log in to access your cart.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            visible: true,
            value: null,
            className:
              "bg-dark text-primary rounded-xl px-6 py-4 hover:bg-primary  hover:bg-dark",
            closeModal: true,
          },
          confirm: {
            text: "Go to Login",
            value: true,
            visible: true,
            className: "bg-primary text-dark rounded-xl px-6 py-4 ",
            closeModal: true,
          },
        },
      }).then((willRedirect) => {
        if (willRedirect) {
          router.push("/joinus");
        }
      });
    }
  }, [token, router]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const uniqueRestaurantIds = Array.from(
        new Set(cartItems.map((item) => item.restaurantId))
      );

      const restaurantIds: number[] = uniqueRestaurantIds.filter(
        (id): id is number => typeof id === "number"
      );

      fetchAllRestaurantInfos(restaurantIds);
    }
  }, [cartItems]);

  const fetchAllRestaurantInfos = async (restaurantIds: number[]) => {
    try {
      const restaurantRequests = restaurantIds.map((id) =>
        axios.get(`${serverDomain}/api/restaurants/${id}`)
      );
      const responses = await Promise.all(restaurantRequests);
      const fetchedRestaurants = responses.map((response) => response.data);
      setRestaurantInfos(fetchedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurant information:", error);
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const groupedItems = cartItems.reduce((groups: any, item) => {
    const group = groups[item.restaurantId] || { items: [], totalPrice: 0 };
    group.items.push(item);
    group.totalPrice += Number(item.price) * Number(item.quantity);
    groups[item.restaurantId] = group;
    return groups;
  }, {});

  const handlePlaceOrder = async (restaurantId: number) => {
    setLoadingStatus((prev) => ({ ...prev, [restaurantId]: true }));
    setOrderError((prev) => ({ ...prev, [restaurantId]: null }));

    const itemsForRestaurant = groupedItems[restaurantId].items;
    const priceForRestaurant = groupedItems[restaurantId].totalPrice;

    try {
      const paymentResult = await handlePayment(
        itemsForRestaurant,
        priceForRestaurant + deliveryFee,
        token,
        restaurantId,
        "flouci"
      );

      if (paymentResult.success) {
        swal("Order placed!", "Redirecting to payment...", "success");
      } else {
        setOrderError((prev) => ({
          ...prev,
          [restaurantId]:
            paymentResult.error || "Payment failed, please try again.",
        }));
      }
    } catch (error) {
      setOrderError((prev) => ({
        ...prev,
        [restaurantId]:
          "An error occurred during the order process. Please try again.",
      }));
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [restaurantId]: false }));
    }
  };

  if (!cartItems.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-primary">Your cart is empty!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 mt-24 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <h1 className="text-5xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-xl text-gray-500">
              Manage your items and checkout
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6 space-x-6">
          <section className="flex-1 space-y-8">
            {Object.keys(groupedItems).map((restaurantId) => {
              const restaurantInfo = restaurantInfos.find(
                (info) => info.id === Number(restaurantId)
              );

              return (
                <div
                  key={restaurantId}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                    Items from{" "}
                    <span className="font-bold text-gray-900">
                      {restaurantInfo
                        ? restaurantInfo.name
                        : `Restaurant ${restaurantId}`}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {groupedItems[restaurantId].items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center p-4 transition-shadow rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
                      >
                        <Image
                          src={item.imageUrl || preview}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="object-cover w-20 h-20 rounded-lg"
                        />
                        <div className="flex flex-col flex-grow ml-4">
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            {item.price} TND
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-center bg-gray-100 rounded-md">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="px-4 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 mt-6 bg-gray-100 border border-gray-200 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">
                      Subtotal for{" "}
                      {restaurantInfo
                        ? restaurantInfo.name
                        : `Restaurant ${restaurantId}`}
                      : {groupedItems[restaurantId].totalPrice.toFixed(2)} TND
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      Delivery Fee: {deliveryFee} TND
                    </p>
                    <p className="mt-2 text-xl font-bold text-gray-900">
                      Total Price:{" "}
                      {(
                        groupedItems[restaurantId].totalPrice + deliveryFee
                      ).toFixed(2)}{" "}
                      TND
                    </p>
                  </div>
                  <Button
                    onClick={() => handlePlaceOrder(Number(restaurantId))}
                    text={
                      loadingStatus[Number(restaurantId)]
                        ? "Processing..."
                        : `Place Order for ${
                            restaurantInfo?.name || "Restaurant"
                          }`
                    }
                    className={`mt-4 w-full shadow ${
                      loadingStatus[Number(restaurantId)] ? "opacity-50" : ""
                    }`}
                    disabled={loadingStatus[Number(restaurantId)]}
                  />
                  {orderError[Number(restaurantId)] && (
                    <p className="mt-4 text-center text-red-500">
                      {orderError[Number(restaurantId)]}
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Cart;
