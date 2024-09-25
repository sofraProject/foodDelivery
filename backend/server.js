// Import necessary modules
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

// App configuration
dotenv.config();
const app = express();

// Global middlewares
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Log HTTP requests

//* Import & Register Routes
//Exemple Route
const sampleRoute = require("./routes/sample.route");
app.use("/api/sample", sampleRoute);

// Start the server
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log("-".repeat(30));
  console.log(`🟢 Server running on : http://localhost:${PORT}`);
  console.log("-".repeat(30));
});
