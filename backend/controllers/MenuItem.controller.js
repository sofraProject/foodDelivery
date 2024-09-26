const { prismaConnection } = require("../prisma/prisma");

// Create a new MenuItem
exports.createMenuItem = async (req, res) => {
  // ... existing code ...
  const newItem = await prismaConnection.menuItem.create(req.body);
  res.status(201).json(newItem);
};

// Get all MenuItems
exports.getAllMenuItems = async (req, res) => {
  // ... existing code ...
  const items = await prismaConnection.menuItem.findMany();
  res.status(200).json(items);
};

// Get a MenuItem by ID
exports.getMenuItemById = async (req, res) => {

  const item = await prismaConnection.menuItem.findUnique(req.params.id);
  res.status(200).json(item);
};

// Update a MenuItem
exports.updateMenuItem = async (req, res) => {
  // ... existing code ...
  await prismaConnection.menuItem.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(204).send();
};

// Delete a MenuItem
exports.deleteMenuItem = async (req, res) => {
  // ... existing code ...
  await prismaConnection.menuItem.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
