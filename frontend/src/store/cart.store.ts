import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    clearCart: () => void;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const existing = get().items.find((i) => i.productId === item.productId);
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },
            removeItem: (productId) =>
                set({ items: get().items.filter((i) => i.productId !== productId) }),
            updateQty: (productId, qty) =>
                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, quantity: qty } : i
                    ),
                }),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: "cart-storage" }
    )
);