// Adds 35 demo sections x 40 products (1400 unique products) and 3 home banners.
// Every product gets its own photo (no photo is used twice). Needs UNSPLASH_ACCESS_KEY or PEXELS_API_KEY in .env.
// Demo photos are not your real products. Replace them and run remove-demo before going live.
// Usage: npm run seed-demo      (safe to run again: old demo items are replaced)
//        npm run remove-demo    (deletes everything this script added; your own items stay)
require('dotenv').config();
require('./dnsFix');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const { getPhotos } = require('./photos');
const { buildCatalog } = require('./catalog');
const { slugify } = require('../utils/helpers');

async function remove() {
  const p = await Product.deleteMany({ isDemo: true });
  const b = await Banner.deleteMany({ isDemo: true });
  let c = 0;
  for (const cat of await Category.find({ isDemo: true })) {
    if (!(await Product.exists({ category: cat._id }))) { await cat.deleteOne(); c++; }
  }
  console.log(`Removed ${p.deletedCount} demo products, ${c} demo sections, ${b.deletedCount} demo banners`);
}

async function seed() {
  const catalog = buildCatalog(); // throws if any section has fewer than 40 unique products
  console.log('Getting photos (first run calls Pexels, later runs use the cache)...');
  const photos = await getPhotos(catalog.map((s) => s.name), 40);
  await remove();

  // skip names that already exist as your own (non-demo) products, so nothing is duplicated
  const existing = new Set((await Product.find({ isDemo: { $ne: true } }).select('name')).map((p) => p.name.toLowerCase()));
  let count = 0, skipped = 0;

  for (const [ci, sec] of catalog.entries()) {
    let cat = await Category.findOne({ slug: slugify(sec.name) });
    const secPhotos = photos.sections[sec.name];
    if (!cat) cat = await Category.create({ name: sec.name, tagline: sec.tagline, image: secPhotos[0].thumb, order: ci, isDemo: true });
    else if (!cat.image) { cat.image = secPhotos[0].thumb; await cat.save(); }

    const docs = [];
    for (const [pi, p] of sec.products.entries()) {
      if (existing.has(p.name.toLowerCase())) { skipped++; continue; }
      docs.push({
        name: p.name, slug: slugify(p.name), fabric: p.material, price: p.price, mrp: p.mrp, stock: p.stock,
        sizes: sec.sizes, isTrending: p.trending, isDemo: true, category: cat._id,
        details: [p.material, ...sec.details],
        description: 'Demo product. Replace this text, the images and the price from the admin panel.',
        colors: p.colors.map(([name, hex]) => ({ name, hex })),
        images: [secPhotos[pi].url],
      });
    }
    if (docs.length) await Product.insertMany(docs, { ordered: true });
    count += docs.length;
    process.stdout.write(`\r${ci + 1}/${catalog.length} sections, ${count} products`);
  }
  process.stdout.write('\n');

  await Banner.insertMany([
    { eyebrow: 'New collection', title: 'Elegant ethnic wear', subtitle: 'Sarees, suits and lehengas for every occasion', image: photos.banners[0] || '', link: '/shop/sarees', order: 0, isDemo: true },
    { eyebrow: 'Festive edit', title: 'Shararas, anarkalis and more', subtitle: 'Ready to wear, ready to celebrate', image: photos.banners[1] || '', link: '/shop/sharara-sets', order: 1, isDemo: true },
    { eyebrow: 'Accessories', title: 'Bags, shoes and jewellery', subtitle: 'Finish every look', image: photos.banners[2] || '', link: '/shop/handbags', buttonText: 'Shop accessories', order: 2, isDemo: true },
  ]);
  console.log(`Added ${count} demo products in ${catalog.length} sections and 3 banners${skipped ? ` (skipped ${skipped} names you already have)` : ''}`);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (process.argv.includes('--remove')) await remove(); else await seed();
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
