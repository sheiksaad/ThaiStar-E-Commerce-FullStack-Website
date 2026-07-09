import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "../store/auth.store";

export default function CartPage() {
    const { items, removeItem, updateQty, total } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 mb-4">Cart khali hai</p>
                <Link to="/products" className="btn-primary">Parts Dekho</Link>
            </div>
        );
    }

    const delivery = 150;

    const handleCheckout = () => {
        if (!user) { navigate("/login"); return; }
        navigate("/checkout");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            <div className="grid md:grid-cols-3 gap-6">

                {/* Items */}
                <div className="md:col-span-2 space-y-3">
                    {items.map((item) => (
                        <div key={item.productId} className="card p-4 flex gap-4">
                            <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center shrink-0">
                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-2xl">🔧</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <p className="text-red-600 font-semibold mt-1">Rs. {item.price.toLocaleString()}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => updateQty(item.productId, Math.max(1, item.quantity - 1))} className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">−</button>
                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQty(item.productId, Math.min(item.stock, item.quantity + 1))} className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">+</button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeItem(item.productId)} className="text-xs text-gray-400 hover:text-red-500 mt-2">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="card p-5 h-fit sticky top-20">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Items</span><span>Rs. {total().toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>Rs. {delivery}</span></div>
                        <div className="border-t pt-2 flex justify-between font-semibold text-base">
                            <span>Total</span><span className="text-red-600">Rs. {(total() + delivery).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onClick={handleCheckout} className="btn-primary w-full mt-5 py-2.5">
                        Order Karo →
                    </button>
                </div>
            </div>
        </div>
    );
}