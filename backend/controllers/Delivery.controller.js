const { prismaConnection } = require("../prisma/prisma");

// Get delivery details and location
const getDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the delivery by the order ID
    const delivery = await prismaConnection.delivery.findUnique({
      where: { orderId: parseInt(orderId) },
      include: {
        location: true,
        driver: { select: { name: true, email: true } },
        order: { select: { status: true } },
      },
    });
    console.log(delivery, "ok");
    if (!delivery) {
      return res.status(400).json({ message: "Delivery not found" });
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
