import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import toast from "react-hot-toast";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const count = useCartStore((s) => s.count());
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logout ho gaye");
        navigate("/");
    };

    return (
        <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
                {/* Logo */}
                <Link to="/" className="text-xl font-semibold tracking-tight">
                    Thai<span className="text-red-500">Star</span>
                </Link>

                {/* Search */}
                <form
                    className="hidden md:flex flex-1 max-w-md mx-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
                        if (q) navigate(`/products?search=${q}`);
                    }}
                >
                    <input
                        name="q"
                        placeholder="Parts dhundho..."
                        className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link to="/cart" className="relative p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                {count}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            {user.role === "ADMIN" && (
                                <Link to="/admin" className="text-sm text-red-400 hover:text-red-300">
                                    Admin
                                </Link>
                            )}
                            <Link to="/orders" className="text-sm text-gray-300 hover:text-white">
                                Orders
                            </Link>
                            <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}