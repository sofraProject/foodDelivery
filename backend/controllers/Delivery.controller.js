const { prismaConnection } = require("../prisma/prisma");

// Get delivery details and location
const getDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Check if orderId is provided and is a valid integer
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Find the delivery by the order ID
    const delivery = await prismaConnection.delivery.findUnique({
      where: { orderId: parseInt(orderId) },
      include: {
        location: true,
        driver: { select: { name: true, email: true } },
        order: { select: { status: true } },
      },
    });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDeliveryStatus,
};
