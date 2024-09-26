const { prismaConnection } = require("../prisma/prisma");

// Create a new Order
exports.createOrder = async (req, res) => {
  // ... existing code ...
  const newOrder = await prismaConnection.order.create(req.body);
  res.status(201).json(newOrder);
};

// Get all Orders
exports.getAllOrders = async (req, res) => {
  // ... existing code ...
  const orders = await Order.findAll();
  res.status(200).json(orders);
};

// Get an Order by ID
exports.getOrderById = async (req, res) => {
  // ... existing code ...
  const order = await prismaConnection.order.findUnique(req.params.id);
  res.status(200).json(order);
};

// Update an Order
exports.updateOrder = async (req, res) => {
  // ... existing code ...
  await prismaConnection.order.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(204).send();
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
  // ... existing code ...
  await prismaConnection.order.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
