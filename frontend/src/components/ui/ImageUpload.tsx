import { useState, useRef } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

interface Props {
    value?: string;
    onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(value || "");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image 5MB se choti honi chahiye");
            return;
        }

        // Local preview
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Cloudinary via backend
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await api.post("/upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onChange(res.data.url);
            toast.success("Image upload ho gayi!");
        } catch {
            toast.error("Upload fail hua, dobara try karo");
            setPreview(value || "");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Upload Area */}
            <div
                onClick={() => !loading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${loading
                        ? "border-gray-200 bg-gray-50 cursor-wait"
                        : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    }`}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        {!loading && (
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">
                                    Change karo
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-6">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-sm font-medium text-gray-600">
                            Click karke image upload karo
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG, WebP — max 5MB
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                        Upload ho raha hai...
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
}