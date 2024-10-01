

import { User } from './userTypes'; // Adjust the import path based on your project structure
import { CartItem } from './cartTypes'; // If OrderItem is similar to CartItem, otherwise define a separate interface

// Enum for order status
export enum OrderStatus {
    pending = "pending",
    confirmed = "confirmed",
    completed = "completed",
    canceled = "canceled",
}

// Interface for the OrderItem model
export interface OrderItem {
    id: number;
    orderId: number;  // Reference to the associated order
    productId: number; // Assuming there is a Product model
    quantity: number;
    price: number;     // Price per item
}

// Interface for the Delivery model
export interface Delivery {
    id: number;
    orderId: number; // Reference to the associated order
    deliveryAddress: string; // Address for delivery
    deliveryDate: Date;      // Date of delivery
}

// Main interface for the Order model
export interface Order {
    id: number;
    user_id: number; // Reference to the user
    status: OrderStatus; // The current status of the order
    totalPrice: number; // Total amount for the order
    orderItems: OrderItem[]; // Array of order items
    deliveries: Delivery[]; // Array of deliveries associated with the order
    user: User; // User who placed the order
    createdAt: Date; // Timestamp when the order was created
    updatedAt: Date; // Timestamp when the order was last updated
}
export interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
  }

