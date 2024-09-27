const { prismaConnection } = require("../prisma/prisma");

// Create a new Delivery
exports.createDelivery = async (req, res) => {
  // ... existing code ...
  const newDelivery = await prismaConnection.delivery.create(req.body);
  res.status(201).json(newDelivery);
};

// Get all Deliveries
exports.getAllDeliveries = async (req, res) => {
  // ... existing code ...
  const deliveries = await prismaConnection.delivery.findMany();
  res.status(200).json(deliveries);
};

// Get a Delivery by ID
exports.getDeliveryById = async (req, res) => {
  // ... existing code ...
  const delivery = await prismaConnection.delivery.findUnique(req.params.id);
  res.status(200).json(delivery);
};

// Update a Delivery
exports.updateDelivery = async (req, res) => {
  // ... existing code ...
  await prismaConnection.delivery.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(204).send();
};

// Delete a Delivery
exports.deleteDelivery = async (req, res) => {
  // ... existing code ...
  await prismaConnection.delivery.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
