// Import necessary modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const { connectToDatabase } = require("./prisma"); // Import connectToDatabase function
const {connectToDatabase } = require("./prisma/prisma")
// App configuration
const app = express();

// Global middlewares
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Log HTTP requests

//* Import & Register Routes
// Example Route
const sampleRoute = require("./routes/sample.route");
app.use("/api/sample", sampleRoute);

// Start the server
const PORT = process.env.SERVER_PORT || 3306; // Provide a default port
app.listen(PORT, async () => {
  console.log("-".repeat(30));
  console.log(`🟢 Server running on : http://localhost:${PORT}`);
  console.log("-".repeat(30));
  
  // Connect to the database when the server starts
  await connectToDatabase();
});
