import { Router, Response } from "express";
import { upload } from "../config/cloudinary";
import cloudinary from "../config/cloudinary";
import { protect, adminOnly } from "../middleware/auth.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/image",
    protect,
    adminOnly,
    upload.single("image"),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: "Image nahi mili" });
                return;
            }

            // Buffer se Cloudinary pe upload karo
            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: "thaistar-products",
                            transformation: [
                                { width: 800, height: 800, crop: "limit", quality: "auto" },
                            ],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    )
                    .end(req.file!.buffer);
            });

            res.json({ url: result.secure_url, public_id: result.public_id });
        } catch (err: any) {
            res.status(500).json({ message: err.message || "Upload fail ho gaya" });
        }
    }
);

export default router;