import { PrismaClient, Category } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const products = [
  { name: "Engine Piston Set (CD70)", description: "Honda CD 70 ke liye high quality piston set", price: 2800, category: Category.ENGINE, brand: "Honda", stock: 25 },
  { name: "Brake Pad Set Front", description: "Sabhi 70cc-125cc bikes ke liye compatible front brake pads", price: 650, category: Category.BRAKES, brand: "Local", stock: 50 },
  { name: "Headlight Bulb 12V 35W", description: "Bright halogen headlight, 6 mahine warranty", price: 180, category: Category.LIGHTS, brand: "Philips", stock: 100 },
  { name: "Chain Sprocket Kit", description: "Complete chain aur sprocket set, 15000km durable", price: 1200, category: Category.ENGINE, brand: "DID", stock: 30 },
  { name: "Air Filter (CG125)", description: "Original Honda CG 125 air filter, engine protection", price: 350, category: Category.ENGINE, brand: "Honda", stock: 40 },
  { name: "Rear Tyre 2.75-17", description: "All weather grip, durable rear tyre", price: 3500, category: Category.TYRES, brand: "Sogo", stock: 20 },
  { name: "Battery 12V 5Ah", description: "Maintenance-free battery, 1 saal warranty", price: 2200, category: Category.ELECTRICAL, brand: "AGS", stock: 15 },
  { name: "Side Mirror Set", description: "Chrome finish side mirrors, pair mein", price: 420, category: Category.BODY, brand: "Local", stock: 60 },
  { name: "Spark Plug NGK CR7HSA", description: "Better ignition aur fuel efficiency", price: 220, category: Category.ENGINE, brand: "NGK", stock: 80 },
  { name: "Speedometer Cable", description: "Smooth aur accurate speedometer reading", price: 180, category: Category.ELECTRICAL, brand: "Local", stock: 35 },
  { name: "Clutch Plate Set", description: "Smooth gear change ke liye complete set", price: 1800, category: Category.ENGINE, brand: "Yamaha", stock: 18 },
  { name: "Front Fork Oil Seal", description: "Leak-proof front fork oil seal pair", price: 450, category: Category.ENGINE, brand: "Local", stock: 25 },
  { name: "Indicator Light Set (4pcs)", description: "LED indicators, bright aur energy efficient", price: 380, category: Category.LIGHTS, brand: "Local", stock: 45 },
  { name: "Engine Oil 20W-50 1L", description: "High quality engine oil, engine life barhata hai", price: 650, category: Category.ENGINE, brand: "Zic", stock: 100 },
  { name: "Rear Brake Shoe", description: "Long lasting drum brake shoes", price: 320, category: Category.BRAKES, brand: "Local", stock: 55 },
  { name: "Front Tyre 2.50-17", description: "All-terrain front tyre, excellent grip", price: 2800, category: Category.TYRES, brand: "Sogo", stock: 22 },
  { name: "Fuel Tank Cap", description: "Locking, rust-proof fuel cap", price: 250, category: Category.BODY, brand: "Local", stock: 40 },
  { name: "Carburetor CD70", description: "Better fuel mixing aur performance", price: 1500, category: Category.ENGINE, brand: "Local", stock: 12 },
  { name: "Seat Cover Universal", description: "Waterproof anti-slip seat cover", price: 550, category: Category.BODY, brand: "Local", stock: 30 },
  { name: "Handlebar Grips Pair", description: "Soft rubber, anti-vibration comfortable grips", price: 150, category: Category.BODY, brand: "Local", stock: 70 },
];

async function main() {
  console.log("🌱 Seeding shuru...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@thaistar.pk",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      city: "Karachi",
    },
  });
  console.log("✅ Admin: admin@thaistar.pk / admin123");

  // Test user
  await prisma.user.create({
    data: {
      name: "Ali Hassan",
      email: "ali@test.com",
      password: await bcrypt.hash("test123", 10),
      city: "Karachi",
    },
  });
  console.log("✅ User: ali@test.com / test123");

  // Products
  await prisma.product.createMany({ data: products });
  console.log(`✅ ${products.length} products add ho gaye`);

  console.log("\n🎉 Database ready! Ab: npm run dev");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
