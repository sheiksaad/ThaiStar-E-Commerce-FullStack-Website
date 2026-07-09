import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import type { Product } from "../types";
import ProductCard from "../components/ui/ProductCard";

const CATEGORIES = ["ENGINE", "BRAKES", "ELECTRICAL", "BODY", "TYRES", "LIGHTS"];
const SORTS = [
    { label: "Newest", value: "" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name A-Z", value: "name" },
];

export default function ProductsPage() {
    const [params, setParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const category = params.get("category") || "";
    const search = params.get("search") || "";
    const sort = params.get("sort") || "";
    const page = Number(params.get("page") || "1");

    useEffect(() => {
        setLoading(true);
        const q = new URLSearchParams();
        if (category) q.set("category", category);
        if (search) q.set("search", search);
        if (sort) q.set("sort", sort);
        q.set("page", String(page));
        q.set("limit", "12");

        api.get(`/products?${q}`).then((r) => {
            setProducts(r.data.products);
            setTotal(r.data.total);
            setLoading(false);
        });
    }, [category, search, sort, page]);

    const set = (key: string, val: string) => {
        const p = new URLSearchParams(params);
        if (val) p.set(key, val);
        else p.delete(key);
        p.delete("page");
        setParams(p);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-48 shrink-0">
                    <h3 className="font-semibold mb-3">Category</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => set("category", "")}
                            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg ${!category ? "bg-red-50 text-red-600 font-medium" : "hover:bg-gray-100"}`}
                        >
                            All
                        </button>
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => set("category", c)}
                                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize ${category === c ? "bg-red-50 text-red-600 font-medium" : "hover:bg-gray-100"}`}
                            >
                                {c.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm text-gray-500">{total} products mile</p>
                        <select
                            value={sort}
                            onChange={(e) => set("sort", e.target.value)}
                            className="input w-auto text-sm"
                        >
                            {SORTS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">Koi product nahi mila</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {total > 12 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                disabled={page === 1}
                                onClick={() => set("page", String(page - 1))}
                                className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
                            >
                                ← Pehle
                            </button>
                            <button
                                disabled={page * 12 >= total}
                                onClick={() => set("page", String(page + 1))}
                                className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Aage →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}