// src/controllers/Driver.controller.js
const { prismaConnection } = require("../prisma/prisma");

// Fetch all drivers from the database
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prismaConnection.user.findMany({
      where: { role: "DRIVER" }, // Filter users by role
    });
    res.json(drivers); // Respond with the list of drivers
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Update driver's location
const updateDriverLocation = async (req, res) => {
  const { driverId, lat, long } = req.body; // Destructure request body

  try {
    // Check if the driver exists and is a DRIVER
    const driver = await prismaConnection.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return res.status(404).json({ message: "Driver not found or unauthorized" });
    }

    // Upsert the driver's location (create if not exists, update if exists)
    const location = await prismaConnection.location.upsert({
      where: { userId: driverId },
      update: { lat, long }, // Update location if it exists
      create: { lat, long, userId: driverId }, // Create a new location if it doesn't
    });

    res.json({ message: "Location updated successfully", location }); // Respond with success message
  } catch (error) {
    console.error("Error updating driver location:", error);
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Delete a driver from the database
const deleteDriver = async (req, res) => {
  const { driverId } = req.params; // Get driverId from request parameters

  try {
    // Check if the driver exists and is a DRIVER
    const driver = await prismaConnection.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return res.status(404).json({ message: "Driver not found or unauthorized" });
    }

    // Delete the driver
    await prismaConnection.user.delete({
      where: { id: driverId },
    });

    res.json({ message: "Driver deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

module.exports = {
  getAllDrivers,
  updateDriverLocation,
  deleteDriver,
};
