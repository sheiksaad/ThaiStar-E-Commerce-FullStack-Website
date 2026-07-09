import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login", form);
            setAuth(res.data.user, res.data.token);
            toast.success("Login ho gaye!");
            navigate(res.data.user.role === "ADMIN" ? "/admin" : "/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login fail ho gaya");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="card w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-center mb-1">Login Karo</h1>
                <p className="text-center text-gray-500 text-sm mb-6">ThaiStar account mein</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Email</label>
                        <input className="input" type="email" placeholder="ali@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Password</label>
                        <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                        {loading ? "Login ho raha hai..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Account nahi hai?{" "}
                    <Link to="/register" className="text-red-600 hover:underline font-medium">Register karo</Link>
                </p>
            </div>
        </div>
    );
}