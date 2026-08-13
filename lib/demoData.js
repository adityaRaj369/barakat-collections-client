// Built-in demo catalogue. Used by the storefront as a fallback so the site
// is always full — even before `npm run db:seed` runs. Shapes match the output
// of serializeProduct() so pages can use these objects directly.

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const DEMO_CATEGORIES = [
  { name: "Vases & Planters", slug: "vases-planters", image: u("photo-1578500494198-246f612d3b3d") },
  { name: "Lighting", slug: "lighting", image: u("photo-1513506003901-1e6a229e2d15") },
  { name: "Wall Décor", slug: "wall-decor", image: u("photo-1533090161767-e6ffed986c88") },
  { name: "Textiles & Cushions", slug: "textiles-cushions", image: u("photo-1584100936595-c0654b55a2e6") },
  { name: "Tableware", slug: "tableware", image: u("photo-1603199506016-b9a594b593c0") },
  { name: "Décor Accents", slug: "decor-accents", image: u("photo-1600166898405-da9535204843") },
];

const raw = [
  ["Terracotta Bud Vase", "vases-planters", 899, 1199, ["photo-1578500494198-246f612d3b3d", "photo-1490312278390-ab64016e0aa9"], "Terracotta", true],
  ["Stoneware Ripple Vase", "vases-planters", 1649, null, ["photo-1493663284031-b7e3aefcae8e", "photo-1519710164239-da123dc03ef4"], "Glazed stoneware", true],
  ["Blue Pottery Planter", "vases-planters", 1299, 1599, ["photo-1485955900006-10f4d324d411", "photo-1459156212016-c812468e2115"], "Blue pottery", false],
  ["Brass Table Lamp", "lighting", 3499, 4299, ["photo-1513506003901-1e6a229e2d15", "photo-1507473885765-e6ed057f782c"], "Cast brass", true],
  ["Cane Pendant Shade", "lighting", 2199, null, ["photo-1524758631624-e2822e304c36", "photo-1540932239986-30128078f3c5"], "Woven cane", false],
  ["Terracotta Diya Set", "lighting", 599, 799, ["photo-1605883705077-8d3d3cebe78c", "photo-1604608672516-f1b9b1d37076"], "Terracotta", false],
  ["Handwoven Wall Hanging", "wall-decor", 2499, null, ["photo-1533090161767-e6ffed986c88", "photo-1526040652367-ac003a0475fe"], "Cotton & wool", true],
  ["Brass Sun Wall Art", "wall-decor", 2899, 3499, ["photo-1493666438817-866a91353ca9", "photo-1516414447565-b14be0adf13e"], "Brass", false],
  ["Madhubani Folk Painting", "wall-decor", 1999, null, ["photo-1578321272176-b7bbc0679853", "photo-1531913764164-f85c52e6e654"], "Natural pigment", true],
  ["Block-print Cushion Cover", "textiles-cushions", 799, 999, ["photo-1584100936595-c0654b55a2e6", "photo-1522708323590-d24dbb6b0267"], "Block-print cotton", true],
  ["Handloom Throw Blanket", "textiles-cushions", 2799, null, ["photo-1616486338812-3dadae4b4ace", "photo-1600369671236-e74521d4b6ad"], "Handloom cotton", false],
  ["Kantha Quilt", "textiles-cushions", 3899, 4599, ["photo-1522771739844-6a9f6d5f14af", "photo-1583847268964-b28dc8f51f92"], "Recycled cotton", true],
  ["Ceramic Dinner Plate Set", "tableware", 2599, null, ["photo-1603199506016-b9a594b593c0", "photo-1578749556568-bc2c40e68b61"], "Glazed ceramic", true],
  ["Wooden Serving Board", "tableware", 1499, 1899, ["photo-1591261730799-ee4e6c2d16d7", "photo-1600585152915-d208bec867a1"], "Sheesham wood", false],
  ["Blue Pottery Bowl Set", "tableware", 1399, null, ["photo-1584346133934-a3044a1a4f5e", "photo-1578662996442-48f60103fc96"], "Blue pottery", false],
  ["Marble Coasters Set", "decor-accents", 999, 1299, ["photo-1600166898405-da9535204843", "photo-1616627561950-9f746e330187"], "Marble & brass", true],
  ["Brass Elephant Figurine", "decor-accents", 1199, 1499, ["photo-1567016376408-0226e4d0c1ea", "photo-1503602642458-232111445657"], "Brass", true],
  ["Jute Storage Basket", "decor-accents", 899, null, ["photo-1595970834061-3b3f39d6d3d1", "photo-1520981825232-ece5fae45120"], "Handwoven jute", false],
  ["Ceramic Table Vase", "vases-planters", 1099, 1399, ["photo-1493663284031-b7e3aefcae8e", "photo-1490312278390-ab64016e0aa9"], "Glazed ceramic", false],
  ["Hanging Macramé Planter", "vases-planters", 749, null, ["photo-1485955900006-10f4d324d411", "photo-1459156212016-c812468e2115"], "Cotton cord", true],
  ["Copper Lantern", "lighting", 1899, 2399, ["photo-1513506003901-1e6a229e2d15", "photo-1540932239986-30128078f3c5"], "Hammered copper", true],
  ["Ceramic Table Lamp", "lighting", 2999, null, ["photo-1507473885765-e6ed057f782c", "photo-1524758631624-e2822e304c36"], "Ceramic base", false],
  ["Mirror Work Wall Panel", "wall-decor", 3299, 3999, ["photo-1516414447565-b14be0adf13e", "photo-1526040652367-ac003a0475fe"], "Wood & glass", true],
  ["Framed Botanical Print", "wall-decor", 1299, null, ["photo-1531913764164-f85c52e6e654", "photo-1578321272176-b7bbc0679853"], "Giclée print", false],
  ["Ikat Cushion Cover Pair", "textiles-cushions", 1199, 1599, ["photo-1522708323590-d24dbb6b0267", "photo-1584100936595-c0654b55a2e6"], "Handwoven cotton", true],
  ["Wool Area Rug", "textiles-cushions", 5499, 6999, ["photo-1600369671236-e74521d4b6ad", "photo-1616486338812-3dadae4b4ace"], "Hand-tufted wool", true],
  ["Terracotta Mug Set", "tableware", 1199, null, ["photo-1578749556568-bc2c40e68b61", "photo-1603199506016-b9a594b593c0"], "Terracotta", false],
  ["Brass Serving Tray", "tableware", 2299, 2799, ["photo-1600585152915-d208bec867a1", "photo-1591261730799-ee4e6c2d16d7"], "Brass", true],
  ["Carved Wooden Bookends", "decor-accents", 1399, null, ["photo-1503602642458-232111445657", "photo-1567016376408-0226e4d0c1ea"], "Sheesham wood", false],
  ["Scented Soy Candle Trio", "decor-accents", 999, 1299, ["photo-1602874801006-e26c4c5b5a5a", "photo-1600166898405-da9535204843"], "Soy wax", true],
  ["Ceramic Pedestal Vase", "vases-planters", 1799, 2199, ["photo-1490312278390-ab64016e0aa9", "photo-1578500494198-246f612d3b3d"], "Glazed ceramic", false],
  ["Terracotta Urli Bowl", "vases-planters", 1499, null, ["photo-1459156212016-c812468e2115", "photo-1485955900006-10f4d324d411"], "Terracotta", true],
  ["Terracotta Wall Sconce", "lighting", 1399, 1799, ["photo-1540932239986-30128078f3c5", "photo-1524758631624-e2822e304c36"], "Terracotta", false],
  ["Beaded Table Lamp", "lighting", 3299, null, ["photo-1507473885765-e6ed057f782c", "photo-1513506003901-1e6a229e2d15"], "Glass beads", true],
  ["Woven Grass Wall Disc", "wall-decor", 1699, 2099, ["photo-1526040652367-ac003a0475fe", "photo-1533090161767-e6ffed986c88"], "Sabai grass", false],
  ["Carved Wooden Panel", "wall-decor", 4299, null, ["photo-1516414447565-b14be0adf13e", "photo-1493666438817-866a91353ca9"], "Mango wood", true],
  ["Velvet Bolster Cushion", "textiles-cushions", 1299, 1699, ["photo-1583847268964-b28dc8f51f92", "photo-1522708323590-d24dbb6b0267"], "Cotton velvet", false],
  ["Cotton Table Runner", "textiles-cushions", 899, null, ["photo-1600369671236-e74521d4b6ad", "photo-1584100936595-c0654b55a2e6"], "Handloom cotton", true],
  ["Stoneware Mug Set", "tableware", 1599, 1999, ["photo-1578749556568-bc2c40e68b61", "photo-1584346133934-a3044a1a4f5e"], "Stoneware", false],
  ["Enamel Serving Bowl", "tableware", 1299, null, ["photo-1578662996442-48f60103fc96", "photo-1600585152915-d208bec867a1"], "Enamelware", true],
  ["Stone Incense Holder", "decor-accents", 699, 899, ["photo-1616627561950-9f746e330187", "photo-1600166898405-da9535204843"], "Soapstone", false],
  ["Woven Seagrass Tray", "decor-accents", 1099, null, ["photo-1520981825232-ece5fae45120", "photo-1595970834061-3b3f39d6d3d1"], "Seagrass", true],
];

function slugify(s) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const catName = (slug) => DEMO_CATEGORIES.find((c) => c.slug === slug)?.name || "";

export const DEMO_PRODUCTS = raw.map(([name, cat, priceR, cmpR, imgs, material, featured], i) => ({
  id: `demo-${i + 1}`,
  name,
  slug: slugify(name),
  description: `Handcrafted ${name.toLowerCase()} made by Indian artisans. Ethically made, beautifully imperfect — a warm, characterful addition to any home.`,
  price: priceR * 100,
  compareAtPrice: cmpR ? cmpR * 100 : null,
  images: imgs.map(u),
  material,
  artisan: "Indian craft cluster",
  origin: "India",
  stock: 8 + ((i * 5) % 30),
  featured: !!featured,
  rating: 4.4 + ((i % 6) * 0.1),
  category: { name: catName(cat), slug: cat },
  categorySlug: cat,
}));

// Filter + sort helper mirroring the /products page behaviour.
export function filterDemo({ category, q, sort, minP, maxP } = {}) {
  let list = [...DEMO_PRODUCTS];
  if (category) list = list.filter((p) => p.categorySlug === category);
  if (q) {
    const s = q.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }
  if (minP != null) list = list.filter((p) => p.price >= minP);
  if (maxP != null) list = list.filter((p) => p.price <= maxP);
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "newest") list.reverse();
  else list.sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}
