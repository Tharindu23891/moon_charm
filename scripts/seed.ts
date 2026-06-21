import 'dotenv/config';
import mongoose from 'mongoose';
import { connectToDatabase } from '../src/lib/mongoose';
import { slugify } from '../src/lib/slugify';
import { hashPassword } from '../src/lib/password';
import { applyDiscount } from '../src/lib/pricing';
import { Category } from '../src/models/Category';
import { Product } from '../src/models/Product';
import { GiftPackage } from '../src/models/GiftPackage';
import { Order } from '../src/models/Order';
import { Cart } from '../src/models/Cart';
import { User } from '../src/models/User';

// All prices are in Sri Lankan Rupees (LKR) to match the app's money formatter.
const img = (id: string) => `https://images.unsplash.com/photo-${id}`;

// Verified-loading Unsplash images (the only image host allowed in next.config.ts).
const IMG = {
  candle: img('1603569283847-aa295f0d016a'),
  candleAlt: img('1607083206869-4c7672e72a8a'),
  chocolate: img('1541592106381-b31e9677c0e5'),
  frame: img('1524758631624-e2822e304c36'),
  plant: img('1485955900006-10f4d324d411'),
  journal: img('1779614026411-d326c9744e8c'),
  giftBox: img('1513883049090-d0b7439799bf'),
  gift: img('1778084765801-a53bc6dc5f96'),
  giftBoxes: img('1549465220-1a8b9238cd48'),
  giftWrap: img('1607344645866-009c320b63e0'),
  skincare: img('1556228720-195a672e8a03'),
  coffee: img('1535632066927-ab7c9ab60908'),
  watch: img('1523275335684-37898b6baf30'),
  perfume: img('1606760227091-3dd870d97f1d'),
  headphones: img('1505740420928-5e560c06d30e'),
  jewelry: img('1602143407151-7111542de6e8'),
  flowers: img('1513201099705-a9746e1e201f'),
  diffuser: img('1571781926291-c477ebfd024b'),
  wallet: img('1572635196237-14b3f281503f'),
  mug: img('1564013799919-ab600027ffc6'),
};

type SeedProduct = {
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  isFeatured?: boolean;
  popularity?: number;
};

const productSeed: SeedProduct[] = [
  // Birthday gifts
  {
    name: 'Handmade Scented Candle',
    categorySlug: 'birthday-gifts',
    shortDescription: 'A calming soy-wax candle with a clean, long burn.',
    description:
      'A premium handmade soy candle poured into a reusable glass jar. Notes of vanilla and sandalwood make it perfect for cozy birthdays and thoughtful gifting.',
    images: [IMG.candle],
    price: 2950,
    stock: 40,
    isFeatured: true,
    popularity: 180,
  },
  {
    name: 'Birthday Surprise Mug',
    categorySlug: 'birthday-gifts',
    shortDescription: 'Ceramic mug with a cheerful birthday message.',
    description:
      'A sturdy 330ml ceramic mug printed with a fun birthday design. Dishwasher and microwave safe, boxed and ready to gift.',
    images: [IMG.mug],
    price: 1950,
    stock: 60,
    popularity: 70,
  },
  {
    name: 'Personalized Birthday Card Set',
    categorySlug: 'birthday-gifts',
    shortDescription: 'A set of 5 hand-finished greeting cards.',
    description:
      'Five textured greeting cards with matching envelopes, ready for your own message. Printed on recycled card stock.',
    images: [IMG.gift],
    price: 1650,
    stock: 80,
    popularity: 45,
  },
  {
    name: 'Galaxy LED Night Lamp',
    categorySlug: 'birthday-gifts',
    shortDescription: 'A colour-changing lamp that projects a starry sky.',
    description:
      'A USB-powered night lamp with 16 colours and a remote. Projects a soft galaxy of stars, a memorable birthday gift for kids and adults alike.',
    images: [IMG.giftWrap],
    price: 3800,
    stock: 35,
    popularity: 95,
  },

  // Anniversary gifts
  {
    name: 'Personalized Photo Frame',
    categorySlug: 'anniversary-gifts',
    shortDescription: 'A modern frame with space for a custom message.',
    description:
      'A minimalist wooden photo frame with a customizable engraving area. Holds a 6x4 print, ideal for anniversaries and weddings.',
    images: [IMG.frame],
    price: 3450,
    stock: 28,
    isFeatured: true,
    popularity: 120,
  },
  {
    name: 'Engraved Couple Watch Set',
    categorySlug: 'anniversary-gifts',
    shortDescription: 'A matching his-and-hers watch pair.',
    description:
      'A coordinated pair of minimalist quartz watches with stainless cases and leather straps. The case backs can be engraved with names or a date.',
    images: [IMG.watch],
    price: 18500,
    stock: 14,
    isFeatured: true,
    popularity: 160,
  },
  {
    name: 'Everlasting Rose in Glass Dome',
    categorySlug: 'anniversary-gifts',
    shortDescription: 'A preserved real rose under a glass dome.',
    description:
      'A genuine preserved rose that lasts for years, set on a wooden base under a clear glass dome with a warm LED string light.',
    images: [IMG.flowers],
    price: 5900,
    stock: 22,
    popularity: 110,
  },
  {
    name: 'Love Letters Memory Box',
    categorySlug: 'anniversary-gifts',
    shortDescription: 'A keepsake box for notes, photos and mementos.',
    description:
      'A linen-wrapped memory box with dividers for cards, photos and small keepsakes. A heartfelt way to store years of memories.',
    images: [IMG.giftBox],
    price: 4200,
    stock: 30,
    popularity: 65,
  },

  // Wedding gifts
  {
    name: 'Wedding Keepsake Journal',
    categorySlug: 'wedding-gifts',
    shortDescription: 'A hardbound journal for wedding memories.',
    description:
      'A premium hardbound journal with gilded edges and prompts to capture the story of the big day. A thoughtful wedding gift.',
    images: [IMG.journal],
    price: 3200,
    stock: 26,
    popularity: 55,
  },
  {
    name: 'Crystal Toasting Flute Pair',
    categorySlug: 'wedding-gifts',
    shortDescription: 'Two lead-free crystal flutes for the toast.',
    description:
      'A pair of hand-polished lead-free crystal flutes in a satin-lined gift box. Perfect for the first toast and every anniversary after.',
    images: [IMG.giftBoxes],
    price: 7800,
    stock: 18,
    popularity: 75,
  },
  {
    name: 'Personalized Cutting Board',
    categorySlug: 'wedding-gifts',
    shortDescription: 'An acacia board engraved with the couple’s names.',
    description:
      'A solid acacia wood serving and cutting board that can be laser-engraved with names and a wedding date. Finished with food-safe oil.',
    images: [IMG.gift],
    price: 5400,
    stock: 24,
    popularity: 60,
  },
  {
    name: 'Silk Bridal Robe Set',
    categorySlug: 'wedding-gifts',
    shortDescription: 'A soft satin robe for getting-ready mornings.',
    description:
      'A lightweight satin robe with a matching belt, ideal for bridal morning photos. One size, presented in a ribboned box.',
    images: [IMG.giftBox],
    price: 9500,
    stock: 16,
    popularity: 50,
  },

  // Valentine gifts
  {
    name: 'Luxury Chocolate Box',
    categorySlug: 'valentine-gifts',
    shortDescription: 'Assorted chocolates in a gift-ready box.',
    description:
      'A curated collection of 24 gourmet chocolates with a smooth finish and rich flavours, presented in a ribboned keepsake box.',
    images: [IMG.chocolate],
    price: 4500,
    stock: 50,
    isFeatured: true,
    popularity: 200,
  },
  {
    name: 'Red Rose Bouquet',
    categorySlug: 'valentine-gifts',
    shortDescription: 'A dozen fresh long-stem red roses.',
    description:
      'Twelve fresh long-stem red roses hand-tied with greenery and wrapped in premium paper. Same-day delivery available in Colombo.',
    images: [IMG.flowers],
    price: 6200,
    stock: 32,
    isFeatured: true,
    popularity: 170,
  },
  {
    name: 'Heartbeat Pendant Necklace',
    categorySlug: 'valentine-gifts',
    shortDescription: 'A sterling silver heartbeat pendant.',
    description:
      'A delicate sterling silver pendant shaped like a heartbeat on an 18-inch chain, presented in a velvet box.',
    images: [IMG.jewelry],
    price: 8900,
    stock: 20,
    isFeatured: true,
    popularity: 140,
  },
  {
    name: 'Couples Spa Hamper',
    categorySlug: 'valentine-gifts',
    shortDescription: 'A pampering set for two.',
    description:
      'A spa hamper with bath salts, two candles, massage oil and chocolate, arranged in a woven tray. Made for a relaxing evening in.',
    images: [IMG.skincare],
    price: 11500,
    stock: 15,
    popularity: 85,
  },

  // Baby gifts
  {
    name: 'Baby Care Starter Kit',
    categorySlug: 'baby-gifts',
    shortDescription: 'Soft essentials for newborn comfort.',
    description:
      'A gentle set of newborn essentials including a hooded towel, mittens, booties and a soft brush, all made with skin-friendly cotton.',
    images: [IMG.giftBox],
    price: 6800,
    stock: 24,
    popularity: 90,
  },
  {
    name: 'Organic Cotton Baby Blanket',
    categorySlug: 'baby-gifts',
    shortDescription: 'A breathable knit blanket for newborns.',
    description:
      'A soft, breathable organic cotton blanket with a gentle knit. Machine washable and perfect for cribs, prams and cuddles.',
    images: [IMG.gift],
    price: 4200,
    stock: 36,
    popularity: 70,
  },
  {
    name: 'Wooden Stacking Toy Set',
    categorySlug: 'baby-gifts',
    shortDescription: 'A non-toxic wooden stacking toy.',
    description:
      'A classic wooden stacking ring toy finished with non-toxic, water-based paint. Encourages motor skills for ages 1 and up.',
    images: [IMG.giftBoxes],
    price: 3600,
    stock: 30,
    popularity: 55,
  },
  {
    name: 'Newborn Milestone Card Pack',
    categorySlug: 'baby-gifts',
    shortDescription: 'A set of 24 milestone photo cards.',
    description:
      'Twenty-four beautifully illustrated milestone cards to mark a baby’s first year of firsts. A lovely baby-shower gift.',
    images: [IMG.gift],
    price: 2400,
    stock: 48,
    popularity: 40,
  },

  // Corporate gifts
  {
    name: 'Corporate Desk Plant',
    categorySlug: 'corporate-gifts',
    shortDescription: 'A low-maintenance plant to brighten desks.',
    description:
      'A potted succulent in a matte ceramic pot, suited to office desks. A tasteful corporate gift for teams and clients.',
    images: [IMG.plant],
    price: 2800,
    stock: 70,
    popularity: 50,
  },
  {
    name: 'Leather Executive Notebook',
    categorySlug: 'corporate-gifts',
    shortDescription: 'A refillable A5 leather notebook.',
    description:
      'A refillable A5 notebook bound in full-grain leather with an elastic closure and pen loop. Can be debossed with a company logo.',
    images: [IMG.journal],
    price: 5200,
    stock: 40,
    popularity: 65,
  },
  {
    name: 'Premium Coffee Gift Set',
    categorySlug: 'corporate-gifts',
    shortDescription: 'Single-origin beans with a ceramic dripper.',
    description:
      'A gift set with 250g of single-origin beans, a ceramic pour-over dripper and filters, boxed for an impressive client gift.',
    images: [IMG.coffee],
    price: 7400,
    stock: 28,
    isFeatured: true,
    popularity: 105,
  },
  {
    name: 'Branded Stainless Travel Mug',
    categorySlug: 'corporate-gifts',
    shortDescription: 'A vacuum-insulated 450ml travel mug.',
    description:
      'A double-walled stainless travel mug that keeps drinks hot for 6 hours. Leak-proof lid, ideal for branded corporate gifting.',
    images: [IMG.mug],
    price: 3100,
    stock: 55,
    popularity: 45,
  },

  // Custom gifts
  {
    name: 'Custom Engraved Keychain',
    categorySlug: 'custom-gifts',
    shortDescription: 'A stainless keychain with custom text.',
    description:
      'A brushed stainless keychain engraved with the name, date or short message of your choice. Small, affordable and personal.',
    images: [IMG.gift],
    price: 1800,
    stock: 90,
    popularity: 60,
  },
  {
    name: 'Personalized Star Map Print',
    categorySlug: 'custom-gifts',
    shortDescription: 'The night sky from a date that matters.',
    description:
      'A framed print of the exact star alignment from any date and location, with a custom title and message. A unique keepsake.',
    images: [IMG.giftWrap],
    price: 4600,
    stock: 26,
    isFeatured: true,
    popularity: 115,
  },
  {
    name: 'Custom Name Necklace',
    categorySlug: 'custom-gifts',
    shortDescription: 'A gold-plated name necklace, made to order.',
    description:
      'A gold-plated necklace cut to spell any name or word, on an adjustable chain. Handmade to order and presented in a gift box.',
    images: [IMG.jewelry],
    price: 9200,
    stock: 18,
    popularity: 95,
  },
  {
    name: 'Photo Collage Canvas',
    categorySlug: 'custom-gifts',
    shortDescription: 'Your photos printed on a gallery canvas.',
    description:
      'A gallery-wrapped canvas printed with a collage of your favourite photos. Ready to hang, available in multiple layouts.',
    images: [IMG.frame],
    price: 5800,
    stock: 22,
    popularity: 70,
  },

  // Other
  {
    name: 'Aromatherapy Essential Oil Set',
    categorySlug: 'other',
    shortDescription: 'Six pure essential oils in a wooden case.',
    description:
      'A set of six pure essential oils, including lavender, eucalyptus and lemongrass, presented in a wooden display case.',
    images: [IMG.diffuser],
    price: 4900,
    stock: 34,
    popularity: 60,
  },
  {
    name: 'Bluetooth Wireless Headphones',
    categorySlug: 'other',
    shortDescription: 'Over-ear headphones with noise isolation.',
    description:
      'Comfortable over-ear wireless headphones with deep bass, 30-hour battery life and a built-in mic. A crowd-pleasing gift.',
    images: [IMG.headphones],
    price: 14500,
    stock: 25,
    isFeatured: true,
    popularity: 150,
  },
  {
    name: 'Minimalist Leather Wallet',
    categorySlug: 'other',
    shortDescription: 'A slim RFID-blocking card wallet.',
    description:
      'A slim full-grain leather wallet with RFID-blocking lining and space for six cards and cash. Ages beautifully with use.',
    images: [IMG.wallet],
    price: 6300,
    stock: 38,
    popularity: 80,
  },
  {
    name: 'Scented Reed Diffuser',
    categorySlug: 'other',
    shortDescription: 'A long-lasting reed diffuser for any room.',
    description:
      'A 200ml reed diffuser with natural rattan reeds and a fresh linen scent that lasts up to three months. Flame-free fragrance.',
    images: [IMG.candleAlt],
    price: 3400,
    stock: 42,
    popularity: 50,
  },
];

type SeedPackage = {
  name: string;
  image: string;
  itemSlugs: { slug: string; quantity: number }[];
  price: number;
  discountPercent?: number;
  isFeatured?: boolean;
  popularity?: number;
};

const packageSeed: SeedPackage[] = [
  {
    name: 'Sweet Celebration Bundle',
    image: IMG.giftBoxes,
    itemSlugs: [
      { slug: slugify('Luxury Chocolate Box'), quantity: 1 },
      { slug: slugify('Handmade Scented Candle'), quantity: 1 },
      { slug: slugify('Birthday Surprise Mug'), quantity: 1 },
    ],
    price: 9400,
    discountPercent: 12,
    isFeatured: true,
    popularity: 130,
  },
  {
    name: 'Romantic Anniversary Set',
    image: IMG.flowers,
    itemSlugs: [
      { slug: slugify('Personalized Photo Frame'), quantity: 1 },
      { slug: slugify('Everlasting Rose in Glass Dome'), quantity: 1 },
      { slug: slugify('Love Letters Memory Box'), quantity: 1 },
    ],
    price: 13550,
    discountPercent: 15,
    isFeatured: true,
    popularity: 110,
  },
  {
    name: 'Wedding Bliss Hamper',
    image: IMG.giftBox,
    itemSlugs: [
      { slug: slugify('Wedding Keepsake Journal'), quantity: 1 },
      { slug: slugify('Crystal Toasting Flute Pair'), quantity: 1 },
      { slug: slugify('Personalized Cutting Board'), quantity: 1 },
    ],
    price: 16400,
    discountPercent: 10,
    isFeatured: true,
    popularity: 90,
  },
  {
    name: 'Valentine Deluxe Box',
    image: IMG.chocolate,
    itemSlugs: [
      { slug: slugify('Luxury Chocolate Box'), quantity: 1 },
      { slug: slugify('Red Rose Bouquet'), quantity: 1 },
      { slug: slugify('Heartbeat Pendant Necklace'), quantity: 1 },
    ],
    price: 19600,
    discountPercent: 15,
    isFeatured: true,
    popularity: 145,
  },
  {
    name: 'New Baby Welcome Hamper',
    image: IMG.giftBox,
    itemSlugs: [
      { slug: slugify('Baby Care Starter Kit'), quantity: 1 },
      { slug: slugify('Organic Cotton Baby Blanket'), quantity: 1 },
      { slug: slugify('Wooden Stacking Toy Set'), quantity: 1 },
    ],
    price: 14600,
    discountPercent: 10,
    popularity: 75,
  },
  {
    name: 'Executive Corporate Hamper',
    image: IMG.coffee,
    itemSlugs: [
      { slug: slugify('Corporate Desk Plant'), quantity: 1 },
      { slug: slugify('Leather Executive Notebook'), quantity: 1 },
      { slug: slugify('Premium Coffee Gift Set'), quantity: 1 },
      { slug: slugify('Branded Stainless Travel Mug'), quantity: 1 },
    ],
    price: 18500,
    discountPercent: 8,
    popularity: 70,
  },
];

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function main() {
  await connectToDatabase();

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    GiftPackage.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Categories
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
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  // Products
  const products = await Product.insertMany(
    productSeed.map((p) => {
      const category = categoryBySlug.get(p.categorySlug);
      if (!category) {
        throw new Error(`Unknown category slug in seed: ${p.categorySlug}`);
      }
      return {
        name: p.name,
        slug: slugify(p.name),
        shortDescription: p.shortDescription,
        description: p.description,
        images: p.images,
        price: p.price,
        categoryId: category._id,
        stock: p.stock,
        isFeatured: p.isFeatured ?? false,
        popularity: p.popularity ?? 0,
      };
    })
  );
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  // Gift packages
  const packages = await GiftPackage.insertMany(
    packageSeed.map((pkg) => ({
      name: pkg.name,
      slug: slugify(pkg.name),
      image: pkg.image,
      items: pkg.itemSlugs.map(({ slug, quantity }) => {
        const product = productBySlug.get(slug);
        if (!product) {
          throw new Error(`Unknown product slug in package "${pkg.name}": ${slug}`);
        }
        return { productId: product._id, quantity };
      }),
      price: pkg.price,
      discountPercent: pkg.discountPercent,
      isFeatured: pkg.isFeatured ?? false,
      popularity: pkg.popularity ?? 0,
    }))
  );
  const packageBySlug = new Map(packages.map((p) => [p.slug, p]));

  // Admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@mooncharm.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  await User.create({
    name: 'Admin',
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    role: 'admin',
  });

  // Demo customers (all share the same password for convenience)
  const customerPassword = 'Password123!';
  const customerPasswordHash = await hashPassword(customerPassword);
  const customerSeed = [
    {
      name: 'Nimal Perera',
      email: 'nimal@example.com',
      address: {
        fullName: 'Nimal Perera',
        email: 'nimal@example.com',
        phone: '+94 77 123 4567',
        line1: '45 Galle Road',
        line2: 'Apartment 7B',
        city: 'Colombo',
        state: 'Western',
        postalCode: '00300',
        country: 'Sri Lanka',
      },
    },
    {
      name: 'Tharushi Fernando',
      email: 'tharushi@example.com',
      address: {
        fullName: 'Tharushi Fernando',
        email: 'tharushi@example.com',
        phone: '+94 71 987 6543',
        line1: '12 Kandy Road',
        line2: '',
        city: 'Kadawatha',
        state: 'Western',
        postalCode: '11850',
        country: 'Sri Lanka',
      },
    },
    {
      name: 'Kasun Silva',
      email: 'kasun@example.com',
      address: {
        fullName: 'Kasun Silva',
        email: 'kasun@example.com',
        phone: '+94 76 555 2211',
        line1: '88 Temple Lane',
        line2: '',
        city: 'Galle',
        state: 'Southern',
        postalCode: '80000',
        country: 'Sri Lanka',
      },
    },
  ];

  const customers = await User.insertMany(
    customerSeed.map((c) => ({
      name: c.name,
      email: c.email,
      passwordHash: customerPasswordHash,
      role: 'user',
    }))
  );
  const customerByEmail = new Map(customers.map((c) => [c.email, c]));
  const addressByEmail = new Map(customerSeed.map((c) => [c.email, c.address]));

  // Helpers to build order line items from products / packages.
  const productItem = (slug: string, quantity: number) => {
    const p = productBySlug.get(slug)!;
    return {
      itemType: 'product' as const,
      refId: p._id,
      name: p.name,
      image: p.images?.[0] ?? '',
      unitPrice: p.price,
      quantity,
    };
  };
  const packageItem = (slug: string, quantity: number) => {
    const pkg = packageBySlug.get(slug)!;
    return {
      itemType: 'package' as const,
      refId: pkg._id,
      name: pkg.name,
      image: pkg.image ?? '',
      unitPrice: applyDiscount(pkg.price, pkg.discountPercent),
      quantity,
    };
  };

  type SeedOrder = {
    email: string;
    items: (ReturnType<typeof productItem> | ReturnType<typeof packageItem>)[];
    paymentMethod: 'cod' | 'card' | 'bank';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
  };

  const orderSeed: SeedOrder[] = [
    {
      email: 'nimal@example.com',
      items: [
        productItem(slugify('Luxury Chocolate Box'), 1),
        productItem(slugify('Red Rose Bouquet'), 1),
      ],
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'delivered',
      createdAt: daysAgo(42),
    },
    {
      email: 'nimal@example.com',
      items: [packageItem(slugify('Valentine Deluxe Box'), 1)],
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'delivered',
      createdAt: daysAgo(31),
    },
    {
      email: 'tharushi@example.com',
      items: [productItem(slugify('Engraved Couple Watch Set'), 1)],
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'shipped',
      createdAt: daysAgo(9),
    },
    {
      email: 'tharushi@example.com',
      items: [
        productItem(slugify('Baby Care Starter Kit'), 1),
        productItem(slugify('Organic Cotton Baby Blanket'), 2),
      ],
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'confirmed',
      createdAt: daysAgo(4),
    },
    {
      email: 'nimal@example.com',
      items: [packageItem(slugify('Sweet Celebration Bundle'), 1)],
      paymentMethod: 'bank',
      paymentStatus: 'paid',
      status: 'processing',
      createdAt: daysAgo(6),
    },
    {
      email: 'kasun@example.com',
      items: [
        productItem(slugify('Bluetooth Wireless Headphones'), 1),
        productItem(slugify('Minimalist Leather Wallet'), 1),
      ],
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'pending',
      createdAt: daysAgo(1),
    },
    {
      email: 'kasun@example.com',
      items: [productItem(slugify('Premium Coffee Gift Set'), 1)],
      paymentMethod: 'cod',
      paymentStatus: 'refunded',
      status: 'cancelled',
      createdAt: daysAgo(19),
    },
  ];

  const orderDocs = orderSeed.map((o) => {
    const subtotal = o.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    return {
      userId: customerByEmail.get(o.email)!._id,
      items: o.items,
      address: addressByEmail.get(o.email)!,
      subtotal,
      total: subtotal,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.createdAt,
    };
  });

  // timestamps:false keeps our backdated createdAt values instead of "now".
  await Order.insertMany(orderDocs, { timestamps: false });

  console.log('Seed complete');
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Products:   ${products.length}`);
  console.log(`  Packages:   ${packages.length}`);
  console.log(`  Customers:  ${customers.length}`);
  console.log(`  Orders:     ${orderDocs.length}`);
  console.log('');
  console.log(`Admin login:    ${adminEmail} / ${adminPassword}`);
  console.log(`Customer login: nimal@example.com / ${customerPassword} (also tharushi@, kasun@)`);
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
