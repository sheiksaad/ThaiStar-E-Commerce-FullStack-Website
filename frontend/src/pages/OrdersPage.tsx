import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Order } from "../types";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/orders/my").then((r) => {
            setOrders(r.data.orders);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Meri Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="mb-4">Koi order nahi hai</p>
                    <Link to="/products" className="btn-primary">Parts Dekho</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link to={`/orders/${order.id}`} key={order.id} className="card p-5 block hover:border-red-300 transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p>
                                    <p className="text-sm mt-2">{order.items.length} items · Rs. {order.totalPrice.toLocaleString()}</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}