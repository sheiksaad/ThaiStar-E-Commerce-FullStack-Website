import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "../store/auth.store";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "Karachi",
        paymentMethod: "COD",
        bikeModel: "",
        notes: "",
    });

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleOrder = async () => {
        if (!form.name || !form.phone || !form.address) {
            toast.error("Saara address bharo"); return;
        }
        setLoading(true);
        try {
            const res = await api.post("/orders", {
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                name: form.name, phone: form.phone, address: form.address,
                city: form.city, paymentMethod: form.paymentMethod,
                bikeModel: form.bikeModel, notes: form.notes,
            });
            clearCart();
            toast.success("Order place ho gaya! 🎉");
            navigate(`/orders/${res.data.order.id}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error aa gaya");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">

                {/* Form */}
                <div className="space-y-4">
                    <h3 className="font-semibold">Delivery Details</h3>
                    {[
                        { label: "Aapka Naam", key: "name", placeholder: "Muhammad Ali" },
                        { label: "Phone", key: "phone", placeholder: "03001234567" },
                        { label: "Address", key: "address", placeholder: "Ghar ka address, mohalla" },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                            <label className="text-sm text-gray-600 block mb-1">{label}</label>
                            <input className="input" placeholder={placeholder} value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} />
                        </div>
                    ))}

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Shehar</label>
                        <select className="input" value={form.city} onChange={(e) => set("city", e.target.value)}>
                            {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"].map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Payment Method</label>
                        <select className="input" value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)}>
                            {["COD", "EasyPaisa", "JazzCash", "Bank Transfer"].map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Bike Model (optional)</label>
                        <input className="input" placeholder="Honda CD 70" value={form.bikeModel} onChange={(e) => set("bikeModel", e.target.value)} />
                    </div>
                </div>

                {/* Summary */}
                <div className="card p-5 h-fit">
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-2 mb-4">
                        {items.map((i) => (
                            <div key={i.productId} className="flex justify-between text-sm">
                                <span className="text-gray-600 truncate">{i.name} × {i.quantity}</span>
                                <span className="font-medium ml-2">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-3 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>Rs. 150</span></div>
                        <div className="flex justify-between font-bold text-base mt-2">
                            <span>Total</span><span className="text-red-600">Rs. {(total() + 150).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onClick={handleOrder} disabled={loading} className="btn-primary w-full mt-5 py-3">
                        {loading ? "Place ho raha hai..." : "✅ Order Place Karo"}
                    </button>
                </div>
            </div>
        </div>
    );
}