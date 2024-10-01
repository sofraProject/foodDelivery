const { prismaConnection } = require("../prisma/prisma");

// Get delivery details and location based on order ID
const getDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Check if orderId is provided and is a valid integer
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Find the delivery details using the order ID
    const delivery = await prismaConnection.delivery.findUnique({
      where: { orderId: parseInt(orderId) },
      include: {
        location: true, // Include location details
        driver: { select: { name: true, email: true } }, // Select driver details
        order: { select: { status: true } }, // Select order status
      },
    });

    // Check if delivery exists
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Respond with the delivery details
    res.json(delivery);
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDeliveryStatus,
};


