// Adds 35 demo sections x 40 products (1400 unique products) and 3 home banners.
// Every product gets its own photo (no photo is used twice). Needs UNSPLASH_ACCESS_KEY or PEXELS_API_KEY in .env.
// Sections are updated as soon as their photos are ready, so a rate limit never leaves you with nothing.
// Usage: npm run seed-demo      (safe to run again)
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
  console.log('Getting photos (saved photos are reused, new ones are fetched)...');
  const photos = await getPhotos(catalog.map((s) => s.name), 40);

  const existing = new Set((await Product.find({ isDemo: { $ne: true } }).select('name')).map((p) => p.name.toLowerCase()));
  let updated = 0, products = 0, skipped = 0;

  for (const [ci, sec] of catalog.entries()) {
    const secPhotos = photos.sections[sec.name];
    if (!secPhotos || secPhotos.length < sec.products.length) continue; // photos not ready yet: keep this section as it is

    let cat = await Category.findOne({ slug: slugify(sec.name) });
    if (!cat) cat = await Category.create({ name: sec.name, tagline: sec.tagline, image: secPhotos[0].thumb, order: ci, isDemo: true });
    else if (cat.isDemo) { cat.image = secPhotos[0].thumb; cat.tagline = sec.tagline; cat.order = ci; await cat.save(); }

    // replace only this section's demo products
    const names = sec.products.map((p) => p.name);
    await Product.deleteMany({ isDemo: true, $or: [{ category: cat._id }, { name: { $in: names } }] });

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
    updated++; products += docs.length;
    process.stdout.write(`\rUpdated ${updated} sections, ${products} products`);
  }
  process.stdout.write('\n');

  if (photos.banners.length >= 3) {
    await Banner.deleteMany({ isDemo: true });
    await Banner.insertMany([
      { eyebrow: 'New collection', title: 'Elegant ethnic wear', subtitle: 'Sarees, suits and lehengas for every occasion', image: photos.banners[0], link: '/shop/sarees', order: 0, isDemo: true },
      { eyebrow: 'Festive edit', title: 'Shararas, anarkalis and more', subtitle: 'Ready to wear, ready to celebrate', image: photos.banners[1], link: '/shop/sharara-sets', order: 1, isDemo: true },
      { eyebrow: 'Accessories', title: 'Bags, shoes and jewellery', subtitle: 'Finish every look', image: photos.banners[2], link: '/shop/handbags', buttonText: 'Shop accessories', order: 2, isDemo: true },
    ]);
    console.log('Banners updated');
  }

  console.log(`Done: ${updated}/${catalog.length} sections updated with ${products} products${skipped ? ` (skipped ${skipped} names you already have)` : ''}.`);
  if (photos.incomplete) console.log(photos.incomplete);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (process.argv.includes('--remove')) await remove(); else await seed();
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
