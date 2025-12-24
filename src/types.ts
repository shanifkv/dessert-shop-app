/**
 * src/types.ts
 * Clean domain types for Dessert Shop
 */

// Shop stored in Firestore
export interface Shop {
  id: string;
  name: string;
  address?: string;
  imageUrl?: string;
  createdAt?: number | null;
}

// Item (dessert)
export interface Item {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  available?: boolean;
}

// Cart item used throughout the UI and when creating orders
export interface CartItem {
  itemId: string; // maps to Item.id
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
  shopId?: string;
}

// Order shape (simplified)
export interface Order {
  id?: string;
  customerId?: string | null;
  shopId?: string | null;
  items: CartItem[];
  total: number;
  status: 'placed' | 'processing' | 'delivered' | 'cancelled';
  createdAt?: any;
  address?: string;
}

