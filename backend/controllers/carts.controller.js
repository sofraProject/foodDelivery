const { prismaConnection } = require("../prisma/prisma");

// Retrieve all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving carts", error: error.message });
  }
};

// Retrieve a cart by customer ID
exports.getCartById = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany({
      where: { customer_id: req.user.id },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            available: true,
            likes: true,
          },
        },
      },
    });

    if (carts.length > 0) {
      const cartsWithNumberPrice = carts.map(cart => ({
        ...cart,
        menuItem: cart.menuItem.map(item => ({
          ...item,
          price: parseFloat(item.price),
        })),
      }));
      res.status(200).json(cartsWithNumberPrice);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ message: "Error retrieving cart", error: error.message });
  }
};

// Create a new cart or update existing one
exports.createCart = async (req, res) => {
  try {
    const { id } = req.user; // Customer ID
    const { restaurant_owner_id, menu_item_id, quantity } = req.body;

    if (!menu_item_id) {
      return res.status(400).json({ message: "menu_item_id is required" });
    }

    // Validate customer
    const customer = await prismaConnection.user.findUnique({ where: { id } });
    if (!customer || customer.role !== "customer") {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    // Validate restaurant owner
    const restaurantOwner = await prismaConnection.user.findUnique({ where: { id: restaurant_owner_id } });
    if (!restaurantOwner || restaurantOwner.role !== "restaurant_owner") {
      return res.status(400).json({ message: "Invalid restaurant owner ID" });
    }

    // Check if the menu item already exists in the customer's cart
    const existingCartItem = await prismaConnection.cart.findUnique({
      where: {
        customer_id_restaurant_owner_id_menu_item_id: {
          customer_id: id,
          restaurant_owner_id,
          menu_item_id,
        },
      },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    // Update quantity if the item exists
    if (existingCartItem) {
      const updatedCartItem = await prismaConnection.cart.update({
        where: {
          customer_id_restaurant_owner_id_menu_item_id: {
            customer_id: id,
            restaurant_owner_id,
            menu_item_id,
          },
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          menuItem: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });
      return res.status(200).json(updatedCartItem);
    }

    // Create a new cart item
    const newCart = await prismaConnection.cart.create({
      data: {
        customer_id: id,
        restaurant_owner_id,
        menu_item_id,
        quantity,
      },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Error creating cart:", error);
    return res.status(500).json({ message: "Error creating cart", error: error.message });
  }
};

// Update a cart item
exports.updateCart = async (req, res) => {
  try {
    const updatedCart = await prismaConnection.cart.update({
      where: { menuitems_id: req.params.id },
      data: req.body,
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// Delete a cart item
exports.deleteCart = async (req, res) => {
  try {
    await prismaConnection.cart.delete({
      where: { menuitems_id: req.params.id },
    });
    res.status(204).json({ message: "Cart deleted" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Error deleting cart", error: error.message });
  }
};

// Retrieve carts by customer ID
exports.getCartByCustomerId = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany({
      where: { customer_id: req.params.customerId },
    });
    if (carts.length > 0) {
      res.status(200).json(carts);
    } else {
      res.status(404).json({ message: "No carts found for this customer" });
    }
  } catch (error) {
    console.error("Error retrieving carts by customer:", error);
    res.status(500).json({
      message: "Error retrieving carts by customer",
      error: error.message,
    });
  }
};

// Retrieve carts by menu item ID
exports.getCartByMenuItemId = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany({
      where: { menuitems_id: req.params.menuItemId },
    });
    if (carts.length > 0) {
      res.status(200).json(carts);
    } else {
      res.status(404).json({ message: "No carts found for this menu item" });
    }
  } catch (error) {
    console.error("Error retrieving carts by menu item:", error);
    res.status(500).json({
      message: "Error retrieving carts by menu item",
      error: error.message,
    });
  }
};

// Retrieve carts by restaurant owner ID
exports.getCartByRestaurantOwnerId = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany({
      where: { restaurant_owner_id: req.params.restaurantOwnerId },
    });
    if (carts.length > 0) {
      res.status(200).json(carts);
    } else {
      res.status(404).json({ message: "No carts found for this restaurant owner" });
    }
  } catch (error) {
    console.error("Error retrieving carts by restaurant owner:", error);
    res.status(500).json({
      message: "Error retrieving carts by restaurant owner",
      error: error.message,
    });
  }
};

// Clear the cart for the logged-in user
exports.clearCart = async (req, res) => {
  const { id } = req.user;
  try {
    await prismaConnection.cart.deleteMany({
      where: { customer_id: id },
    });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
