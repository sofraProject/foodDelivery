const { prismaConnection } = require("../prisma2/prisma");

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving carts", error });
  }
};

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
            availble: true,
            likes: true,
          },
        },
      },
    });

    if (carts.length > 0) {
      const cartsWithNumberPrice = carts.map((cart) => ({
        ...cart,
        menuItem: {
          ...cart.menuItem,
          price: parseFloat(cart.menuItem.price),
        },
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

exports.createCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { restaurant_owner_id, menuitems_id, quantity } = req.body;

    const customer = await prismaConnection.user.findUnique({ where: { id } });
    if (!customer || customer.role !== "customer") {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const restaurantOwner = await prismaConnection.user.findUnique({ where: { id: restaurant_owner_id } });
    if (!restaurantOwner || restaurantOwner.role !== "restaurant_owner") {
      return res.status(400).json({ message: "Invalid restaurant owner ID" });
    }

    const existingCartItem = await prismaConnection.cart.findUnique({
      where: {
        customer_id_restaurant_owner_id_menuitems_id: {
          customer_id: id,
          restaurant_owner_id,
          menuitems_id,
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

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await prismaConnection.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity },
      });
      res.status(200).json(existingCartItem);
    } else {
      const newCart = await prismaConnection.cart.create({
        data: {
          customer_id: id,
          restaurant_owner_id,
          menuitems_id,
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
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating cart", error: error.message });
  }
};

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
    res.status(500).json({ message: "Error updating cart", error });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const deleted = await prismaConnection.cart.delete({
      where: { menuitems_id: req.params.id },
    });
    res.status(204).json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart", error });
  }
};

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
    res.status(500).json({ message: "Error retrieving carts by customer", error });
  }
};

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
    res.status(500).json({ message: "Error retrieving carts by menu item", error });
  }
};

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
    res.status(500).json({ message: "Error retrieving carts by restaurant owner", error });
  }
};

exports.clearCart = async (req, res) => {
  const { id } = req.user;
  try {
    await prismaConnection.cart.deleteMany({
      where: { customer_id: id },
    });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
