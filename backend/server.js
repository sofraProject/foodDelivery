// Import required modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
require("dotenv").config();
const bodyParser = require("body-parser");

// Import routes
const orderRoutes = require("./routes/Order.route");
const menuItemRoutes = require("./routes/MenuItem.route");
const deliveryRoutes = require("./routes/Delivery.route");
const driverRoutes = require("./routes/Driver.route");
const paymentRoutes = require("./routes/Payment.route");
const userRoutes = require("./routes/User.route");
const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const categoryRoutes = require("./routes/category.route");
const restaurantRoutes = require("./routes/Restaurant.route");
const LocationRoutes = require("./routes/Location.route");
const orderItemRoutes = require("./routes/Orderitem.route")
const adminRoutes = require("./routes/admin.route");

// Import utility functions
const { connectToDatabase } = require("./prisma/prisma");
const { initSocket } = require("./socketManager");

// Create Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
helmet({
  crossOriginResourcePolicy: false,
});

// Define API routes
app.use("/api/orders", orderRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/locations", LocationRoutes);
app.use("/api/orderitem  " ,  orderItemRoutes)
app.use("/api/admin", adminRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO (make sure this comes after server creation)
initSocket(server);

// Start server and connect to the database
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Connect to Prisma database
  try {
    await connectToDatabase();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
