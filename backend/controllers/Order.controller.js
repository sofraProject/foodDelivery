const { prismaConnection } = require("../prisma/prisma");






// Create a new Order
exports.createOrder = async (req, res) => {
  const { total_amount, user_id, orderItems } = req.body; // Ensure you get these from the request body

  // Validate required fields
  if (!total_amount || !user_id || !orderItems) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newOrder = await prismaConnection.order.create({
      data: {
        total_amount: parseFloat(total_amount), // Use parseFloat to convert to a number
        user_id: parseInt(user_id), // Ensure user_id is an integer
        orderItems: {
          create: orderItems, // Assuming orderItems is an array of items
        },
        // You can add other fields as necessary
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get all Orders
exports.getAllOrders = async (req, res) => {
  const orders = await prismaConnection.order.findMany();
  res.status(200).json(orders);
};

// Get an Order by ID
exports.getOrderById = async (req, res) => {
  const order = await prismaConnection.order.findUnique({ where: { id: parseInt(req.params.id) } });
  res.status(200).json(order);
};

// Update an Order
exports.updateOrder = async (req, res) => {
  await prismaConnection.order.update({
    where: { id: parseInt(req.params.id) },
    data: req.body,
  });
  res.status(204).send();
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
  await prismaConnection.order.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
};

// Accept Order
exports.acceptOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prismaConnection.order.update({
      where: { id: parseInt(id) },
      data: { status: 'confirmed' },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to accept order" });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prismaConnection.order.update({
      where: { id: parseInt(id) },
      data: { status: 'canceled' },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
};
