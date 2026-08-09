// Demo catalogue seed for KALAKART.
// Run with:  npm run db:seed   (after db:push / db:migrate)

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// Demo admin account (change in production).
const ADMIN_EMAIL = "admin@barakatcollections.com";
const ADMIN_PASSWORD = "barakat@admin1";

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const categories = [
  {
    name: "Vases & Planters",
    slug: "vases-planters",
    description: "Hand-thrown pottery, terracotta and blue-pottery vessels.",
    image: img("photo-1578500494198-246f612d3b3d"),
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Brass lamps, cane shades and handmade diyas.",
    image: img("photo-1513506003901-1e6a229e2d15"),
  },
  {
    name: "Wall Décor",
    slug: "wall-decor",
    description: "Handwoven hangings, folk art and metal wall pieces.",
    image: img("photo-1533090161767-e6ffed986c88"),
  },
  {
    name: "Textiles & Cushions",
    slug: "textiles-cushions",
    description: "Block-print, handloom and kantha home textiles.",
    image: img("photo-1584100936595-c0654b55a2e6"),
  },
  {
    name: "Tableware",
    slug: "tableware",
    description: "Ceramic, wood and blue-pottery for the table.",
    image: img("photo-1603199506016-b9a594b593c0"),
  },
  {
    name: "Décor Accents",
    slug: "decor-accents",
    description: "Figurines, coasters, baskets and finishing touches.",
    image: img("photo-1600166898405-da9535204843"),
  },
];

// price/compareAtPrice in paise
const products = [
  // Vases & Planters
  { name: "Terracotta Bud Vase", cat: "vases-planters", price: 89900, compare: 119900, material: "Terracotta", artisan: "Kumhar collective, Rajasthan", origin: "Rajasthan", featured: true, imgs: ["photo-1578500494198-246f612d3b3d", "photo-1490312278390-ab64016e0aa9"], desc: "A softly rounded bud vase hand-thrown in natural terracotta and left unglazed to age gracefully. Each piece carries the gentle marks of the potter's wheel." },
  { name: "Stoneware Ripple Vase", cat: "vases-planters", price: 164900, material: "Glazed stoneware", artisan: "Studio Mitti", origin: "Jaipur", featured: true, imgs: ["photo-1612196808214-b40b3f3f0f0a", "photo-1493663284031-b7e3aefcae8e"], desc: "A tall stoneware vase with a hand-carved ripple texture and a matte reactive glaze. No two glazes fire exactly alike." },
  { name: "Blue Pottery Planter", cat: "vases-planters", price: 129900, material: "Blue pottery", artisan: "Jaipur Blue Studio", origin: "Jaipur", imgs: ["photo-1485955900006-10f4d324d411", "photo-1459156212016-c812468e2115"], desc: "Hand-painted Jaipur blue-pottery planter with a traditional floral motif, glazed and food-safe." },
  // Lighting
  { name: "Brass Table Lamp", cat: "lighting", price: 349900, compare: 429900, material: "Cast brass", artisan: "Moradabad metalsmiths", origin: "Uttar Pradesh", featured: true, imgs: ["photo-1513506003901-1e6a229e2d15", "photo-1507473885765-e6ed057f782c"], desc: "A sculptural cast-brass lamp base finished by hand, paired with a natural cotton shade. Warm, gallery-quality light." },
  { name: "Cane Pendant Shade", cat: "lighting", price: 219900, material: "Woven cane", artisan: "Assam weavers", origin: "Assam", imgs: ["photo-1524758631624-e2822e304c36", "photo-1540932239986-30128078f3c5"], desc: "An airy woven-cane pendant shade that throws a beautiful dappled shadow. Hand-woven over a steel frame." },
  { name: "Terracotta Diya Set (Set of 6)", cat: "lighting", price: 59900, material: "Terracotta", artisan: "Village potters, Bengal", origin: "West Bengal", imgs: ["photo-1605883705077-8d3d3cebe78c", "photo-1604608672516-f1b9b1d37076"], desc: "A set of six hand-shaped terracotta diyas, perfect for festivals and everyday warmth." },
  // Wall Décor
  { name: "Handwoven Wall Hanging", cat: "wall-decor", price: 249900, material: "Handspun cotton & wool", artisan: "Kutch weavers", origin: "Gujarat", featured: true, imgs: ["photo-1533090161767-e6ffed986c88", "photo-1526040652367-ac003a0475fe"], desc: "A textured macramé-style wall hanging handwoven with undyed cotton and wool, finished with a reclaimed teak dowel." },
  { name: "Brass Sun Wall Art", cat: "wall-decor", price: 289900, material: "Brass", artisan: "Moradabad metalsmiths", origin: "Uttar Pradesh", imgs: ["photo-1493666438817-866a91353ca9", "photo-1516414447565-b14be0adf13e"], desc: "A radiant hand-finished brass sun, hammered and polished to catch the light on any wall." },
  { name: "Madhubani Folk Painting", cat: "wall-decor", price: 199900, material: "Natural pigment on handmade paper", artisan: "Mithila artists", origin: "Bihar", imgs: ["photo-1578321272176-b7bbc0679853", "photo-1531913764164-f85c52e6e654"], desc: "A hand-painted Madhubani artwork in natural pigments, depicting the tree of life. Signed by the artist." },
  // Textiles & Cushions
  { name: "Block-print Cushion Cover", cat: "textiles-cushions", price: 79900, compare: 99900, material: "Hand block-printed cotton", artisan: "Bagru printers", origin: "Rajasthan", featured: true, imgs: ["photo-1584100936595-c0654b55a2e6", "photo-1522708323590-d24dbb6b0267"], desc: "A 16x16in cushion cover hand block-printed with natural dyes using centuries-old Bagru techniques." },
  { name: "Handloom Throw Blanket", cat: "textiles-cushions", price: 279900, material: "Handloom cotton", artisan: "Handloom cooperative", origin: "Tamil Nadu", imgs: ["photo-1616486338812-3dadae4b4ace", "photo-1600369671236-e74521d4b6ad"], desc: "A breathable handloom throw with a subtle woven stripe and hand-knotted tassels." },
  { name: "Kantha Quilt", cat: "textiles-cushions", price: 389900, material: "Recycled cotton, kantha stitch", artisan: "Bengal stitchers", origin: "West Bengal", imgs: ["photo-1522771739844-6a9f6d5f14af", "photo-1583847268964-b28dc8f51f92"], desc: "A reversible kantha quilt hand-stitched from layered cotton saris — soft, light and one-of-a-kind." },
  // Tableware
  { name: "Ceramic Dinner Plate (Set of 4)", cat: "tableware", price: 259900, material: "Glazed ceramic", artisan: "Studio Mitti", origin: "Jaipur", featured: true, imgs: ["photo-1603199506016-b9a594b593c0", "photo-1578749556568-bc2c40e68b61"], desc: "Four hand-glazed dinner plates with an organic reactive finish. Microwave and dishwasher safe." },
  { name: "Wooden Serving Board", cat: "tableware", price: 149900, material: "Sheesham wood", artisan: "Saharanpur woodcraft", origin: "Uttar Pradesh", imgs: ["photo-1591261730799-ee4e6c2d16d7", "photo-1600585152915-d208bec867a1"], desc: "A hand-carved sheesham serving board with a live edge and food-safe oil finish." },
  { name: "Blue Pottery Bowl (Set of 2)", cat: "tableware", price: 139900, material: "Blue pottery", artisan: "Jaipur Blue Studio", origin: "Jaipur", imgs: ["photo-1584346133934-a3044a1a4f5e", "photo-1578662996442-48f60103fc96"], desc: "Two hand-painted blue-pottery bowls, glazed and finished for everyday use." },
  // Décor Accents
  { name: "Marble Coasters (Set of 4)", cat: "decor-accents", price: 99900, material: "Marble & brass inlay", artisan: "Agra marble artisans", origin: "Agra", imgs: ["photo-1600166898405-da9535204843", "photo-1616627561950-9f746e330187"], desc: "Four white-marble coasters with a delicate brass inlay border. Weighty, cool and elegant." },
  { name: "Brass Elephant Figurine", cat: "decor-accents", price: 119900, compare: 149900, material: "Brass", artisan: "Moradabad metalsmiths", origin: "Uttar Pradesh", featured: true, imgs: ["photo-1567016376408-0226e4d0c1ea", "photo-1503602642458-232111445657"], desc: "A hand-cast brass elephant with fine engraved detailing — a timeless symbol of good fortune." },
  { name: "Jute Storage Basket", cat: "decor-accents", price: 89900, material: "Handwoven jute", artisan: "Self-help women's group", origin: "West Bengal", imgs: ["photo-1595970834061-3b3f39d6d3d1", "photo-1520981825232-ece5fae45120"], desc: "A sturdy handwoven jute basket with cotton handles — beautiful storage that gives back." },
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding KALAKART demo data…");

  const catMap = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image },
      create: c,
    });
    catMap[c.slug] = row.id;
  }

  // Reset products for a clean, repeatable demo.
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  let i = 0;
  for (const p of products) {
    i++;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        description: p.desc,
        price: p.price,
        compareAtPrice: p.compare ?? null,
        images: JSON.stringify(p.imgs.map(img)),
        material: p.material ?? null,
        artisan: p.artisan ?? null,
        origin: p.origin ?? null,
        stock: 15 + ((i * 7) % 40),
        featured: !!p.featured,
        rating: 4.5 + ((i % 5) * 0.1),
        categoryId: catMap[p.cat],
      },
    });
  }

  // Demo admin account
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "admin", passwordHash, name: "Barakat Admin" },
    create: {
      email: ADMIN_EMAIL,
      name: "Barakat Admin",
      role: "admin",
      passwordHash,
    },
  });

  const count = await prisma.product.count();
  console.log(`Seed complete: ${categories.length} categories, ${count} products.`);
  console.log("");
  console.log("  Admin login:");
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
