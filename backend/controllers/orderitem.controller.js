const { prismaConnection } = require("../prisma/prisma");

/**
 * Get order items by order ID.
 */
exports.getOrderItemsByOrderId = async (req, res) => {
    const { orderId } = req.params;

    try {
        const orderItems = await prismaConnection.orderItem.findMany({
            where: { orderId: parseInt(orderId) },
            include: { menuItem: true }, // Include details of the menu items
        });
        res.status(200).json(orderItems);
    } catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({ message: "Error fetching order items." });
    }
};

/**
 * Create a new order item.
 */
exports.createOrderItem = async (req, res) => {
    const { orderId, menuItemId, quantity, price } = req.body;

    try {
        const newOrderItem = await prismaConnection.orderItem.create({
            data: { orderId, menuItemId, quantity, price },
        });
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error("Error creating order item:", error);
        res.status(400).json({ message: "Error creating order item.", error });
    }
};

/**
 * Update an existing order item.
 */
exports.updateOrderItem = async (req, res) => {
    const { orderItemId } = req.params;
    const { quantity, price } = req.body;

    try {
        const updatedOrderItem = await prismaConnection.orderItem.update({
            where: { id: parseInt(orderItemId) },
            data: { quantity, price },
        });
        res.status(200).json(updatedOrderItem);
    } catch (error) {
        console.error("Error updating order item:", error);
        res.status(400).json({ message: "Error updating order item.", error });
    }
};

/**
 * Delete an order item.
 */
exports.deleteOrderItem = async (req, res) => {
    const { orderItemId } = req.params;

    try {
        await prismaConnection.orderItem.delete({ where: { id: parseInt(orderItemId) } });
        res.status(204).json({ message: "Order item deleted successfully." });
    } catch (error) {
        console.error("Error deleting order item:", error);
        res.status(500).json({ message: "Error deleting order item.", error });
    }
};
