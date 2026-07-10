import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import ImageUpload from "../components/ui/ImageUpload";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [revenue, setRevenue] = useState(0);
    const [tab, setTab] = useState<"orders" | "add">("orders");
    const [form, setForm] = useState({ name: "", description: "", price: "", category: "ENGINE", brand: "", stock: "", image: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/orders").then((r) => {
            setOrders(r.data.orders);
            setRevenue(r.data.totalRevenue);
        });
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
            toast.success("Status update ho gaya");
        } catch {
            toast.error("Error aa gaya");
        }
    };

    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
            toast.success("Product add ho gaya!");
            setForm({ name: "", description: "", price: "", category: "ENGINE", brand: "", stock: "", image: "" });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    ["Total Orders", orders.length],
                    ["Revenue", `Rs. ${revenue.toLocaleString()}`],
                    ["Pending", orders.filter((o) => o.status === "PENDING").length],
                    ["Delivered", orders.filter((o) => o.status === "DELIVERED").length],
                ].map(([label, val]) => (
                    <div key={label as string} className="card p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{val}</div>
                        <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {(["orders", "add"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? "bg-red-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {t === "orders" ? "📦 Orders" : "➕ Product Add"}
                    </button>
                ))}
            </div>

            {/* Orders Tab */}
            {tab === "orders" && (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {["Order ID", "Customer", "Amount", "Status", "Action"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                                    <td className="px-4 py-3">
                                        <div>{order.user?.name}</div>
                                        <div className="text-gray-400 text-xs">{order.phone}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">Rs. {order.totalPrice.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded px-2 py-1"
                                        >
                                            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Tab */}
            {tab === "add" && (
                <div className="card p-6 max-w-xl">
                    <form onSubmit={addProduct} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">
                                Product Image
                            </label>
                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm({ ...form, image: url })}
                            />
                        </div>
                        {[
                            { label: "Part ka Naam", key: "name", placeholder: "Brake Pad Set" },
                            { label: "Description", key: "description", placeholder: "Product ki detail" },
                            { label: "Brand", key: "brand", placeholder: "Honda / Local" },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key}>
                                <label className="text-sm text-gray-600 block mb-1">{label}</label>
                                <input className="input" type="text" placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Qeemat (Rs.)</label>
                                <input className="input" type="number" placeholder="500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Stock</label>
                                <input className="input" type="number" placeholder="10" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Category</label>
                            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                {["ENGINE", "BRAKES", "ELECTRICAL", "BODY", "TYRES", "LIGHTS", "OTHER"].map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                            {loading ? "Add ho raha hai..." : "Product Add Karo"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}