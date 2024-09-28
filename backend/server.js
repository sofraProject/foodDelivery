const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./prisma/prisma");
require("dotenv").config();

const restaurantRoutes = require("./routes/restaurant.route");
const orderRoutes = require("./routes/Order.route");
const menuItemRoutes = require("./routes/MenuItem.route");
const deliveryRoutes = require("./routes/Delivery.route");
const paymentRoutes = require("./routes/Payment.route");

const userRoutes = require("./routes/User.route");
const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const categoryRoutes = require("./routes/category.route");
// const { connectToDatabase } = require("./prisma"); // Import connectToDatabase function

// App configuration

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/orders", orderRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.SERVER_PORT;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("updateDeliveryLocation", (data) => {
    console.log("Emitting delivery update:", data);
    io.emit(`deliveryUpdate-${data.orderId}`, data.location);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase();
});
