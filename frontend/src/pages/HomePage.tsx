import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { Product } from "../types";
import ProductCard from "../components/ui/ProductCard";

const CATEGORIES = ["ENGINE", "BRAKES", "ELECTRICAL", "BODY", "TYRES", "LIGHTS"];

export default function HomePage() {
    const [featured, setFeatured] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/products?limit=8").then((r) => {
            setFeatured(r.data.products);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Pakistan ka <span className="text-red-500">#1</span>
                        <br /> Bike Parts Store
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">
                        Honda, Yamaha, Suzuki — sab kuch yahan milega
                    </p>
                    <div className="flex gap-3 mt-6">
                        <Link to="/products" className="btn-primary px-6 py-2.5">
                            Parts Dekho
                        </Link>
                        <Link to="/register" className="btn-outline px-6 py-2.5 border-gray-600 text-gray-300 hover:bg-gray-800">
                            Account Banao
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-red-600 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[["500+", "Parts"], ["10k+", "Customers"], ["24hr", "Karachi Delivery"], ["100%", "Genuine"]].map(
                        ([num, label]) => (
                            <div key={label}>
                                <div className="text-2xl font-bold">{num}</div>
                                <div className="text-red-100 text-sm">{label}</div>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-xl font-semibold mb-6">Categories</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => navigate(`/products?category=${cat}`)}
                            className="card p-4 text-center hover:border-red-400 hover:shadow-md transition-all"
                        >
                            <div className="text-2xl mb-1">
                                {cat === "ENGINE" ? "⚙️" : cat === "BRAKES" ? "🛑" : cat === "ELECTRICAL" ? "⚡" : cat === "BODY" ? "🏍️" : cat === "TYRES" ? "🔵" : "💡"}
                            </div>
                            <div className="text-xs font-medium capitalize">{cat.toLowerCase()}</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Featured Parts</h2>
                    <Link to="/products" className="text-sm text-red-600 hover:underline">
                        Sab dekho →
                    </Link>
                </div>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card h-64 animate-pulse bg-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featured.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}