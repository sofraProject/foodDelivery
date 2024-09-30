const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow connections from any origin
    },
  });

  // Handle Socket.IO connections
  io.on("connection", (socket) => {
    console.log("A user connected via Socket.IO");

    // Event for handling order confirmation
    socket.on("orderConfirmed", (data) => {
      console.log(`Order ${data.orderId} confirmed by the restaurant`);
      io.emit(`orderConfirmation-${data.orderId}`, { status: "confirmed" });
    });

    // Event for updating delivery location
    socket.on("updateDeliveryLocation", (data) => {
      console.log("Delivery update received for order:", data);
      io.emit(`deliveryUpdate-${data.orderId}`, data.location);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Listen for driver location updates
    socket.on("driverLocationUpdate", (data) => {
      const { orderId, latitude, longitude } = data;
      updateDriverLocation(orderId, latitude, longitude);
      io.emit(`deliveryUpdate-${orderId}`, { latitude, longitude });
    });
  });
};

const getIoInstance = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

module.exports = { initSocket, getIoInstance };
