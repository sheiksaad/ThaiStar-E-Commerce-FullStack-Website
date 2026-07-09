import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { useCartStore } from "../../store/cart.store";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((s) => s.addItem);

    const handleAdd = () => {
        if (product.stock === 0) return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            stock: product.stock,
        });
        toast.success("Cart mein add ho gaya!");
    };

    return (
        <div className="card hover:border-red-300 transition-colors duration-200 overflow-hidden group">
            {/* Image */}
            <Link to={`/products/${product.id}`}>
                <div className="bg-gray-100 h-44 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="text-5xl">🔧</div>
                    )}
                </div>
            </Link>

            {/* Body */}
            <div className="p-3">
                <span className="text-xs text-red-500 font-medium uppercase tracking-wide">
                    {product.category}
                </span>
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-sm mt-1 hover:text-red-600 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-red-600 font-semibold text-base">
                        Rs. {product.price.toLocaleString()}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={product.stock === 0}
                        className="btn-primary text-xs py-1.5 px-3"
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add"}
                    </button>
                </div>

                {product.stock < 5 && product.stock > 0 && (
                    <p className="text-xs text-orange-500 mt-1">Sirf {product.stock} bacha!</p>
                )}
            </div>
        </div>
    );
}