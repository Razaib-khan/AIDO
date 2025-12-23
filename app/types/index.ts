/**
 * Type definitions for Fishera marketplace
 */

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: "fish" | "shrimp" | "crab" | "shellfish" | string;
  price: number;
  unit: string;
  stock: number;
  freshness: "fresh" | "frozen" | string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalPrice: number;
  shippingAddress: Record<string, any>;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  isBuyer: boolean;
  isSeller: boolean;
  sellerVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}
