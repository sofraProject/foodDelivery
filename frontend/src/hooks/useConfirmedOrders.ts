import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

type OrderData = {
  orderId: number;
  restaurantId: number;
  totalPrice: number;
  status: string;
  driverId: number | null;
};

const useConfirmedOrders = (serverDomain: string) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<OrderData | null>(null);

  const fetchConfirmedOrders = async () => {
    try {
      const response = await axios.get(
        `${serverDomain}/api/orders/status/confirmed`
      );
      const availableOrders = response.data.filter(
        (order: OrderData) => order.driverId === null
      );
      setOrders(availableOrders);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedOrders();

    if (!serverDomain) return;

    const socket = io(serverDomain);

    socket.on("orderPaymentConfirmed", (data: OrderData) => {
      setOrders((prevOrders) => [...prevOrders, data]);
      setNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverDomain]);

  return { orders, loading, error, notification, setNotification };
};

export default useConfirmedOrders;
