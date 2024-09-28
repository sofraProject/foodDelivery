// Import des modules nécessaires
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import des routes
const orderRoutes = require("./routes/Order.route");
const menuItemRoutes = require("./routes/MenuItem.route");
const deliveryRoutes = require("./routes/Delivery.route");
const paymentRoutes = require("./routes/Payment.route");
const userRoutes = require("./routes/User.route");
const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const categoryRoutes = require("./routes/category.route");
const restaurantRoutes = require("./routes/Restaurant.route");

// Import des fonctions utilitaires
const { connectToDatabase } = require("./prisma/prisma");

// Configuration de l'application Express
const app = express();
const PORT = process.env.SERVER_PORT;

// Configuration des middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Définition des routes API
app.use("/api/orders", orderRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);

// Création du serveur HTTP et initialisation de Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
  },
});

// Attacher l'instance de Socket.io à l'application pour un accès global
app.set("io", io);

// Gestion des événements Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  // Événement pour mettre à jour la localisation de livraison
  socket.on("updateDeliveryLocation", (data) => {
    console.log("Emitting delivery update:", data);
    io.emit(`deliveryUpdate-${data.orderId}`, data.location);
  });

  // Gestion de la déconnexion des utilisateurs
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Lancement du serveur et connexion à la base de données
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Connexion à la base de données Prisma
  try {
    await connectToDatabase();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
