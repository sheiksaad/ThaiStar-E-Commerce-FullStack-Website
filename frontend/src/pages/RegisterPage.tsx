import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", city: "Karachi" });
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", form);
            setAuth(res.data.user, res.data.token);
            toast.success("Account ban gaya!");
            navigate("/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error aa gaya");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="card w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-center mb-1">Account Banao</h1>
                <p className="text-center text-gray-500 text-sm mb-6">ThaiStar pe free register karo</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: "Naam", key: "name", type: "text", placeholder: "Muhammad Ali" },
                        { label: "Email", key: "email", type: "email", placeholder: "ali@gmail.com" },
                        { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
                        { label: "Phone (optional)", key: "phone", type: "text", placeholder: "03001234567" },
                    ].map(({ label, key, type, placeholder }) => (
                        <div key={key}>
                            <label className="text-sm text-gray-600 block mb-1">{label}</label>
                            <input className="input" type={type} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== "phone"} />
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                        {loading ? "Ban raha hai..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Pehle se account hai?{" "}
                    <Link to="/login" className="text-red-600 hover:underline font-medium">Login karo</Link>
                </p>
            </div>
        </div>
    );
}