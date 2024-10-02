const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// Controller to manage users, restaurants, orders, drivers, and statistics


// Retrieve all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};


// Retrieve all restaurants (for admin)
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prismaConnection.restaurant.findMany({
      include: { owner: true, category: true },
    });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants." });
  }
};


// Retrieve all orders (for admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prismaConnection.order.findMany({
      include: {
        customer: true,
        restaurant: true,
        driver: true,
        orderItems: {
          include: { menuItem: true },
        },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};


// Update the status of an order (for admin)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  try {
    const updatedOrder = await prismaConnection.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.status(200).json({ message: "Order status updated successfully.", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

// Create a new restaurant (for admin)
exports.createRestaurant = async (req, res) => {
  const { name, description, ownerId, categoryId } = req.body;

  if (!name || !ownerId) {
    return res.status(400).json({ error: "Name and owner ID are required." });
  }

  try {
    const newRestaurant = await prismaConnection.restaurant.create({
      data: {
        name,
        description,
        owner: { connect: { id: Number(ownerId) } },
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Failed to create restaurant." });
  }
};

// Update a restaurant (for admin)
exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, description, ownerId, categoryId } = req.body;

  try {
    const updatedRestaurant = await prismaConnection.restaurant.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        owner: ownerId ? { connect: { id: Number(ownerId) } } : undefined,
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
    });
    res.status(200).json({ message: "Restaurant updated successfully.", updatedRestaurant });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Failed to update restaurant." });
  }
};

// Delete a restaurant (for admin)
exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.restaurant.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Failed to delete restaurant." });
  }
};

// Retrieve all drivers (for admin)
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await prismaConnection.user.findMany({
      where: { role: "DRIVER" },
    });
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers." });
  }
};

// Create a new driver (for admin)
exports.createDriver = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDriver = await prismaConnection.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DRIVER",
      },
    });
    res.status(201).json(newDriver);
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ error: "Failed to create driver." });
  }
};

// Update a driver (for admin)
exports.updateDriver = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedData = { name, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedDriver = await prismaConnection.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    res.status(200).json({ message: "Driver updated successfully.", updatedDriver });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ error: "Failed to update driver." });
  }
};

// Delete a driver (for admin)
exports.deleteDriver = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Driver deleted successfully." });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ error: "Failed to delete driver." });
  }
};

// Retrieve general statistics (for admin)
exports.getStatistics = async (req, res) => {
  try {
    const userCount = await prismaConnection.user.count();
    const restaurantCount = await prismaConnection.restaurant.count();
    const orderCount = await prismaConnection.order.count();
    const totalRevenue = await prismaConnection.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    res.status(200).json({
      userCount,
      restaurantCount,
      orderCount,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics." });
  }
};
