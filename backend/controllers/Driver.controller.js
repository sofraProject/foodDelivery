const { prismaConnection } = require("../prisma/prisma");

// Update driver's location
const updateDriverLocation = async (req, res) => {
  const { driverId, lat, long } = req.body;

  try {
    // Verify the driver exists and has the role of "DRIVER"
    const driver = await prismaConnection.user.findUnique({
      where: { id: driverId },
    });

    if (!driver || driver.role !== "DRIVER") {
      return res
        .status(404)
        .json({ message: "Driver not found or unauthorized" });
    }

    // Create or update the driver's location
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

module.exports = {
  updateDriverLocation,
};
