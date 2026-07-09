import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/orders/${id}`).then((r) => {
            setOrder(r.data);
            setLoading(false);
        });
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
        );

    if (!order)
        return (
            <div className="text-center py-20 text-gray-500">Order nahi mila</div>
        );

    const stepIndex = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Order #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                >
                    {order.status}
                </span>
            </div>

            {/* Progress Bar */}
            {order.status !== "CANCELLED" && (
                <div className="card p-5 mb-5">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -z-0" />
                        <div
                            className="absolute left-0 top-4 h-0.5 bg-red-500 transition-all duration-500 -z-0"
                            style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                        {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex flex-col items-center z-10">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIndex
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {i < stepIndex ? "✓" : i + 1}
                                </div>
                                <span className="text-xs mt-2 text-gray-500 capitalize">
                                    {step.toLowerCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="card p-5 mb-5">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                    {order.items.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-400">
                                    Rs. {item.price.toLocaleString()} × {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold text-sm">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t space-y-1 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Items Total</span>
                        <span>
                            Rs. {(order.totalPrice - order.deliveryPrice).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Delivery</span>
                        <span>Rs. {order.deliveryPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1">
                        <span>Total</span>
                        <span className="text-red-600">
                            Rs. {order.totalPrice.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Delivery Info */}
            <div className="card p-5 mb-6">
                <h3 className="font-semibold mb-3">Delivery Details</h3>
                <div className="text-sm space-y-1 text-gray-600">
                    <p>
                        <span className="font-medium text-gray-800">Naam:</span> {order.name}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Phone:</span>{" "}
                        {order.phone}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Address:</span>{" "}
                        {order.address}, {order.city}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Payment:</span>{" "}
                        {order.paymentMethod}
                    </p>
                    {order.bikeModel && (
                        <p>
                            <span className="font-medium text-gray-800">Bike:</span>{" "}
                            {order.bikeModel}
                        </p>
                    )}
                </div>
            </div>

            <Link to="/orders" className="btn-outline text-sm">
                ← Wapas Orders
            </Link>
        </div>
    );
}