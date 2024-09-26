const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./prisma2/prisma");
require("dotenv").config();

const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const categoryRoutes = require("./routes/category.route");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.SERVER_PORT || 5000;
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
    console.log("User disconnected" );
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase();
});
