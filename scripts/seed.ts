import 'dotenv/config';
import mongoose from 'mongoose';
import { connectToDatabase } from '../src/lib/mongoose';
import { slugify } from '../src/lib/slugify';
import { hashPassword } from '../src/lib/password';
import { Category } from '../src/models/Category';
import { Product } from '../src/models/Product';
import { GiftPackage } from '../src/models/GiftPackage';
import { User } from '../src/models/User';

async function main() {
  await connectToDatabase();

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    GiftPackage.deleteMany({}),
    User.deleteMany({}),
  ]);

  const categoryNames = [
    'Birthday gifts',
    'Anniversary gifts',
    'Wedding gifts',
    'Valentine gifts',
    'Baby gifts',
    'Corporate gifts',
    'Custom gifts',
    'Other',
  ];

  const categories = await Category.insertMany(
    categoryNames.map((name) => ({ name, slug: slugify(name) }))
  );

  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  const products = await Product.insertMany([
    {
      name: 'Handmade Scented Candle',
      slug: slugify('Handmade Scented Candle'),
      shortDescription: 'A calming scented candle with a clean burn.',
      description:
        'A premium handmade candle perfect for cozy nights and thoughtful gifting. Comes in a reusable glass jar.',
      images: [
        'https://images.unsplash.com/photo-1603569283847-aa295f0d016a',
      ],
      price: 18.99,
      categoryId: bySlug.get('birthday-gifts')!._id,
      stock: 25,
      isFeatured: true,
      popularity: 120,
    },
    {
      name: 'Luxury Chocolate Box',
      slug: slugify('Luxury Chocolate Box'),
      shortDescription: 'Assorted chocolates in a gift-ready box.',
      description:
        'A curated collection of gourmet chocolates with a smooth finish and rich flavors. Perfect for celebrations.',
      images: [
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5',
      ],
      price: 24.5,
      categoryId: bySlug.get('valentine-gifts')!._id,
      stock: 40,
      isFeatured: true,
      popularity: 150,
    },
    {
      name: 'Personalized Photo Frame',
      slug: slugify('Personalized Photo Frame'),
      shortDescription: 'A modern frame with space for a custom message.',
      description:
        'A minimalist photo frame with a customizable engraving area. Ideal for anniversaries and weddings.',
      images: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      ],
      price: 29.99,
      categoryId: bySlug.get('anniversary-gifts')!._id,
      stock: 12,
      isFeatured: true,
      popularity: 80,
    },
    {
      name: 'Baby Care Starter Kit',
      slug: slugify('Baby Care Starter Kit'),
      shortDescription: 'Soft essentials for newborn comfort.',
      description:
        'A gentle set of baby essentials made with skin-friendly materials. Great for baby showers and new parents.',
      images: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      ],
      price: 34,
      categoryId: bySlug.get('baby-gifts')!._id,
      stock: 18,
      isFeatured: false,
      popularity: 60,
    },
    {
      name: 'Corporate Desk Plant',
      slug: slugify('Corporate Desk Plant'),
      shortDescription: 'A small plant to brighten workspaces.',
      description:
        'A low-maintenance plant suitable for office desks. A tasteful corporate gift option for teams and clients.',
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
      ],
      price: 21,
      categoryId: bySlug.get('corporate-gifts')!._id,
      stock: 55,
      isFeatured: false,
      popularity: 40,
    },
    {
      name: 'Wedding Keepsake Journal',
      slug: slugify('Wedding Keepsake Journal'),
      shortDescription: 'A keepsake journal for wedding memories.',
      description:
        'A premium hardbound journal designed to capture special moments. A thoughtful wedding gift.',
      images: [
        'https://images.unsplash.com/photo-1779614026411-d326c9744e8c',
      ],
      price: 27.5,
      categoryId: bySlug.get('wedding-gifts')!._id,
      stock: 14,
      isFeatured: false,
      popularity: 35,
    },
  ]);

  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  await GiftPackage.insertMany([
    {
      name: 'Sweet Celebration Bundle',
      slug: slugify('Sweet Celebration Bundle'),
      image:
        'https://images.unsplash.com/photo-1513883049090-d0b7439799bf',
      items: [
        { productId: productBySlug.get(slugify('Luxury Chocolate Box'))!._id, quantity: 1 },
        { productId: productBySlug.get(slugify('Handmade Scented Candle'))!._id, quantity: 1 },
      ],
      price: 39.99,
      discountPercent: 10,
      isFeatured: true,
      popularity: 90,
    },
    {
      name: 'Memory Maker Set',
      slug: slugify('Memory Maker Set'),
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      items: [
        { productId: productBySlug.get(slugify('Personalized Photo Frame'))!._id, quantity: 1 },
        { productId: productBySlug.get(slugify('Wedding Keepsake Journal'))!._id, quantity: 1 },
      ],
      price: 52,
      discountPercent: 15,
      isFeatured: true,
      popularity: 70,
    },
  ]);

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@mooncharm.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';

  await User.create({
    name: 'Admin',
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    role: 'admin',
  });

  console.log('Seed complete');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
