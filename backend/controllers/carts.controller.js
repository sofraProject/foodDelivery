const { prismaConnection } = require("../prisma/prisma");

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await prismaConnection.cart.findMany();
    res.status(200).json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving carts", error: error.message });
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
            available: true,
            likes: true,
          },
        },
      },
    });

    if (carts.length > 0) {
      const cartsWithNumberPrice = carts.map((cart) => ({
        ...cart,
        menuItem: cart.menuItem.map((item) => ({
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
    res
      .status(500)
      .json({ message: "Error retrieving cart", error: error.message });
  }
};

exports.createCart = async (req, res) => {
  try {
    const { id } = req.user; // ID du client
    const { restaurant_owner_id, menu_item_id, quantity } = req.body; // Correction: menu_item_id
    console.log(req.body);
    if (!menu_item_id) {
      return res.status(400).json({ message: "menu_item_id is required" });
    }

    // Vérifier si l'utilisateur est un client valide
    const customer = await prismaConnection.user.findUnique({ where: { id } });
    if (!customer || customer.role !== "customer") {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    // Vérifier si le propriétaire du restaurant est valide
    const restaurantOwner = await prismaConnection.user.findUnique({
      where: { id: restaurant_owner_id },
    });
    if (!restaurantOwner || restaurantOwner.role !== "restaurant_owner") {
      return res.status(400).json({ message: "Invalid restaurant owner ID" });
    }

    // Vérifier si l'article de menu existe déjà dans le panier du client
    const existingCartItem = await prismaConnection.cart.findUnique({
      where: {
        customer_id_restaurant_owner_id_menu_item_id: {
          customer_id: id,
          restaurant_owner_id,
          menu_item_id, // Correction: assurer que menu_item_id est bien utilisé ici
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

    // Si l'article existe déjà dans le panier, mettre à jour la quantité
    if (existingCartItem) {
      const updatedCartItem = await prismaConnection.cart.update({
        where: {
          customer_id_restaurant_owner_id_menu_item_id: {
            // Utiliser la clé composée
            customer_id: id,
            restaurant_owner_id,
            menu_item_id,
          },
        },
        data: {
          quantity: existingCartItem.quantity + quantity, // Augmenter la quantité
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

    // Sinon, créer un nouvel article dans le panier
    const newCart = await prismaConnection.cart.create({
      data: {
        customer_id: id,
        restaurant_owner_id,
        menu_item_id, // Utiliser le nom correct
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
    return res
      .status(500)
      .json({ message: "Error creating cart", error: error.message });
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
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const deleted = await prismaConnection.cart.delete({
      where: { menuitems_id: req.params.id },
    });
    res.status(204).json({ message: "Cart deleted" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res
      .status(500)
      .json({ message: "Error deleting cart", error: error.message });
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
    console.error("Error retrieving carts by customer:", error);
    res.status(500).json({
      message: "Error retrieving carts by customer",
      error: error.message,
    });
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
    console.error("Error retrieving carts by menu item:", error);
    res.status(500).json({
      message: "Error retrieving carts by menu item",
      error: error.message,
    });
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
      res
        .status(404)
        .json({ message: "No carts found for this restaurant owner" });
    }
  } catch (error) {
    console.error("Error retrieving carts by restaurant owner:", error);
    res.status(500).json({
      message: "Error retrieving carts by restaurant owner",
      error: error.message,
    });
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
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};
