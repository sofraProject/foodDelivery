// Import necessary modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRoute = require("./routes/User.route");

const orderRoutes = require("./routes/Order.route");
const menuItemRoutes = require("./routes/MenuItem.route");
const deliveryRoutes = require("./routes/Delivery.route");
// const { connectToDatabase } = require("./prisma"); // Import connectToDatabase function
const { connectToDatabase } = require("./prisma/prisma");
// App configuration
const app = express();

// Global middlewares
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Log HTTP requests

//Order/MenuItem/Delivery
app.use("/api/orders", orderRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/deliveries", deliveryRoutes);

app.use("/api/user", userRoute);
//* Import & Register Routes
// Example Route
// app.use();
// Start the server
const PORT = process.env.SERVER_PORT || 3306; // Provide a default port
app.listen(PORT, async () => {
  console.log("-".repeat(30));
  console.log(`🟢 Server running on : http://localhost:${PORT}`);
  console.log("-".repeat(30));

  // Connect to the database when the server starts
  await connectToDatabase();
});
