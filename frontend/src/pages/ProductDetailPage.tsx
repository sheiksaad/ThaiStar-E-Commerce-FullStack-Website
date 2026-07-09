import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import type { Product } from "../types";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        api.get(`/products/${id}`).then((r) => {
            setProduct(r.data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
    if (!product) return <div className="text-center py-20 text-gray-500">Product nahi mila</div>;

    const handleAdd = () => {
        addItem({ productId: product.id, name: product.name, price: product.price, quantity: qty, image: product.image, stock: product.stock });
        toast.success("Cart mein add ho gaya!");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-10">
                {/* Image */}
                <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                        <span className="text-8xl">🔧</span>
                    )}
                </div>

                {/* Info */}
                <div>
                    <span className="text-sm text-red-500 font-medium uppercase">{product.category}</span>
                    <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">Brand: {product.brand}</p>
                    <p className="text-3xl font-bold text-red-600 mt-4">Rs. {product.price.toLocaleString()}</p>

                    <p className="text-gray-600 mt-4 text-sm leading-relaxed">{product.description}</p>

                    <div className={`mt-4 text-sm font-medium ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} pieces available`}
                    </div>

                    {product.stock > 0 && (
                        <div className="flex items-center gap-3 mt-5">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg hover:bg-gray-50">−</button>
                                <span className="px-4 py-2 font-medium">{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-lg hover:bg-gray-50">+</button>
                            </div>
                            <button onClick={handleAdd} className="btn-primary flex-1 py-2.5">
                                Cart Mein Add Karo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}