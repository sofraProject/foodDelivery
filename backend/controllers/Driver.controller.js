// src/controllers/Driver.controller.js
const { prismaConnection } = require("../prisma/prisma");

// Fetch all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prismaConnection.user.findMany({
      where: { role: "DRIVER" },
    });
    res.json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Update driver's location
const updateDriverLocation = async (req, res) => {
  const { driverId, lat, long } = req.body;

  try {
    const driver = await prismaConnection.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return res.status(404).json({ message: "Driver not found or unauthorized" });
    }

    const location = await prismaConnection.location.upsert({
      where: { userId: driverId },
      update: { lat, long },
      create: { lat, long, userId: driverId },
    });

    res.json({ message: "Location updated successfully", location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a driver
const deleteDriver = async (req, res) => {
  const { driverId } = req.params;

  try {
    const driver = await prismaConnection.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return res.status(404).json({ message: "Driver not found or unauthorized" });
    }

    await prismaConnection.user.delete({
      where: { id: driverId },
    });

    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDrivers,
  updateDriverLocation,
  deleteDriver,
};
