export interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    phone?: string;
    address?: string;
    city: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    image?: string;
    isActive: boolean;
    createdAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice: number;
    deliveryPrice: number;
    paymentMethod: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    bikeModel?: string;
    items: OrderItem[];
    createdAt: string;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    stock: number;
}