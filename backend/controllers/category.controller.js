const { prismaConnection } = require("../prisma/prisma");

// Retrieve all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prismaConnection.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a category by its ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prismaConnection.category.findUnique({ where: { id: Number(id) } });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a category by its name
exports.getCategoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const category = await prismaConnection.category.findUnique({ where: { name } });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, imageUrl } = req.body;
  try {
    const newCategory = await prismaConnection.category.create({
      data: { name, imageUrl },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const updatedCategory = await prismaConnection.category.update({
      where: { id: Number(id) },
      data: { name, imageUrl },
    });
    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.category.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
