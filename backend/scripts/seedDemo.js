// Adds demo sections (categories), 7 products in each, and home banners — all with illustrated placeholder images.
// Usage: npm run seed-demo      (safe to run again: old demo items are replaced)
//        npm run remove-demo    (deletes everything this script added; your own items stay)
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const { productImage, categoryImage, bannerImage } = require('./demoArt');
const { slugify } = require('../utils/helpers');

const PAL = [
  ['Pink', '#C2185B', '#D4A437'], ['Maroon', '#7B1530', '#D4A437'], ['Teal', '#1F6F78', '#E8B4C8'], ['Navy', '#2F3E66', '#F4C7D3'],
  ['Mint', '#7FB7A4', '#FFF0F5'], ['Lilac', '#B39DDB', '#FFFFFF'], ['Green', '#5E7D4F', '#F3D9A4'], ['Mustard', '#C9962B', '#7A1F3D'],
  ['Wine', '#6A1B4D', '#E0B75A'], ['Rose', '#E57399', '#FFF0F5'], ['Black', '#2E1A23', '#F4C7D3'], ['Beige', '#D9C3A5', '#8E6B45'],
  ['Peach', '#F6C1A6', '#8E1446'], ['Red', '#B0103A', '#D4A437'], ['Sky', '#7FA7D9', '#FFFFFF'], ['Olive', '#7D7F4E', '#F1E9DE'],
  ['Coral', '#E8735A', '#FFFFFF'], ['Blush', '#E8B7C8', '#C9A24A'],
];
const DENIM = [['Indigo', '#2C4A7A', '#D9A441'], ['Light blue', '#7C9CC4', '#D9A441'], ['Black', '#2E2E38', '#BDBDBD'], ['Grey', '#6B6F7A', '#E0E0E0']];

const FREE = ['Free Size'];
const STD = ['S', 'M', 'L', 'XL', 'XXL'];

// [section, tagline, artType, sizes, commonDetails, [[product, fabric, price, mrp] x7], palette?]
const SECTIONS = [
  ['Sarees', 'Grace in every drape', 'saree', FREE, ['Includes blouse piece', '6.3 m with blouse', 'Dry clean only'], [
    ['Banarasi Silk Saree', 'Silk', 2999, 4499], ['Georgette Saree', 'Georgette', 1999, 2999], ['Chiffon Saree', 'Chiffon', 1599, 2499],
    ['Kanjivaram Saree', 'Silk', 3499, 5499], ['Organza Floral Saree', 'Organza', 2499, 3499], ['Cotton Handloom Saree', 'Cotton', 1299, 1799],
    ['Sequin Party Saree', 'Georgette', 3999, 5999]]],
  ['Kurtis', 'Comfort meets style', 'kurti', STD, ['Calf length', 'Regular fit', 'Hand wash'], [
    ['Floral Kurti Set', 'Cotton', 1899, 2499], ['Chikankari Kurti', 'Cotton', 1499, 1999], ['Anarkali Kurti', 'Rayon', 2199, 2999],
    ['A-Line Printed Kurti', 'Rayon', 999, 1499], ['Straight Cotton Kurti', 'Cotton', 899, 1299], ['Angrakha Kurti', 'Cotton', 1299, 1799],
    ['Mirror Work Kurti', 'Rayon', 1699, 2299]]],
  ['Salwar Suits', 'Classic and comfortable', 'suit', STD, ['Kurta, salwar and dupatta', 'Ready to wear', 'Hand wash'], [
    ['Patiala Suit Set', 'Cotton', 1999, 2799], ['Straight Salwar Suit', 'Cotton', 1799, 2499], ['Embroidered Salwar Suit', 'Georgette', 2999, 3999],
    ['Chanderi Suit Set', 'Chanderi', 2499, 3299], ['Printed Cotton Suit', 'Cotton', 1499, 1999], ['Silk Salwar Suit', 'Silk', 3499, 4699],
    ['Phulkari Suit Set', 'Cotton', 2299, 2999]]],
  ['Lehengas', 'For your special moments', 'lehenga', ['S', 'M', 'L', 'XL'], ['Lehenga, blouse and dupatta', 'Can-can lining', 'Dry clean only'], [
    ['Bridal Lehenga Set', 'Silk', 8999, 12999], ['Pastel Net Lehenga', 'Net', 5499, 7499], ['Mirror Work Lehenga', 'Cotton', 3999, 5499],
    ['Velvet Lehenga', 'Velvet', 7499, 9999], ['Sequin Lehenga', 'Georgette', 6499, 8999], ['Printed Cotton Lehenga', 'Cotton', 2999, 3999],
    ['Floral Organza Lehenga', 'Organza', 5999, 7999]]],
  ['Sharara Sets', 'Festive and flowing', 'sharara', STD, ['Kurta, sharara and dupatta', 'Ready to wear', 'Hand wash'], [
    ['Gota Sharara Set', 'Georgette', 2999, 3999], ['Mirror Work Sharara Set', 'Rayon', 2499, 3299], ['Printed Sharara Set', 'Cotton', 1999, 2699],
    ['Embroidered Sharara Set', 'Georgette', 3499, 4699], ['Pastel Sharara Set', 'Organza', 3299, 4499], ['Festive Silk Sharara Set', 'Silk', 3999, 5299],
    ['Chikankari Sharara Set', 'Cotton', 2799, 3699]]],
  ['Gowns', 'Made to make an entry', 'gown', STD, ['Floor length', 'Lined', 'Dry clean only'], [
    ['Embroidered Anarkali Gown', 'Georgette', 3499, 4999], ['Evening Satin Gown', 'Satin', 3999, 5499], ['Flared Party Gown', 'Net', 4499, 5999],
    ['Velvet Gown', 'Velvet', 4999, 6999], ['Printed Maxi Gown', 'Rayon', 1999, 2799], ['Sequin Gown', 'Georgette', 5499, 7499],
    ['Off Shoulder Gown', 'Crepe', 3299, 4499]]],
  ['Dresses', 'For every mood', 'dress', STD, ['Lined', 'Regular fit', 'Hand wash'], [
    ['Tiered Maxi Dress', 'Georgette', 1799, 2499], ['Wrap Midi Dress', 'Crepe', 1599, 2199], ['Floral Sundress', 'Cotton', 1299, 1799],
    ['Bodycon Party Dress', 'Lycra', 1499, 2199], ['Shirt Dress', 'Cotton', 1399, 1899], ['Ruffle Hem Dress', 'Georgette', 1699, 2399],
    ['Smocked Midi Dress', 'Rayon', 1499, 1999]]],
  ['Co-ords', 'Matched and ready', 'coord', STD, ['Top and bottom set', 'Relaxed fit', 'Machine wash'], [
    ['Printed Co-ord Set', 'Cotton', 1999, 2799], ['Linen Co-ord Set', 'Linen', 2299, 2999], ['Kurta Palazzo Co-ord', 'Rayon', 1799, 2499],
    ['Shirt and Shorts Co-ord', 'Cotton', 1499, 1999], ['Crop Top Skirt Co-ord', 'Georgette', 2199, 2999], ['Lounge Co-ord Set', 'Cotton', 1299, 1799],
    ['Satin Co-ord Set', 'Satin', 2499, 3299]]],
  ['Jumpsuits', 'One piece, done', 'jumpsuit', STD, ['Zip closure', 'Regular fit', 'Machine wash'], [
    ['Wide Leg Jumpsuit', 'Crepe', 1799, 2499], ['Denim Jumpsuit', 'Denim', 1999, 2699], ['Printed Jumpsuit', 'Rayon', 1499, 1999],
    ['Belted Jumpsuit', 'Crepe', 1699, 2299], ['Satin Jumpsuit', 'Satin', 2199, 2899], ['Linen Jumpsuit', 'Linen', 1899, 2499],
    ['Halter Jumpsuit', 'Georgette', 1799, 2399]]],
  ['Tops', 'Casuals to classics', 'top', STD, ['Regular fit', 'Machine wash'], [
    ['Embroidered Cotton Top', 'Cotton', 899, 1299], ['Peplum Top', 'Rayon', 799, 1099], ['Ruffle Sleeve Top', 'Georgette', 849, 1199],
    ['Basic Crop Top', 'Cotton', 599, 899], ['Wrap Top', 'Crepe', 899, 1299], ['Puff Sleeve Top', 'Cotton', 749, 1099],
    ['Lace Detail Top', 'Rayon', 999, 1399]]],
  ['Blouses', 'The perfect match', 'blouse', ['32', '34', '36', '38', '40'], ['Padded', 'Back hook closure', 'Dry clean only'], [
    ['Silk Readymade Blouse', 'Silk', 899, 1299], ['Sequin Blouse', 'Georgette', 1199, 1699], ['Mirror Work Blouse', 'Cotton', 999, 1399],
    ['Puff Sleeve Blouse', 'Silk', 1099, 1499], ['Brocade Blouse', 'Brocade', 1299, 1799], ['Halter Neck Blouse', 'Georgette', 1099, 1499],
    ['Velvet Blouse', 'Velvet', 1199, 1599]]],
  ['Bottoms', 'Style from waist down', 'bottoms', STD, ['Elastic waist', 'Machine wash'], [
    ['Wide Leg Palazzo', 'Rayon', 999, 1399], ['Straight Cotton Pants', 'Cotton', 899, 1199], ['Cigarette Pants', 'Cotton', 949, 1299],
    ['Printed Palazzo', 'Rayon', 799, 1099], ['Dhoti Pants', 'Cotton', 899, 1299], ['Ankle Leggings', 'Cotton Lycra', 399, 599],
    ['Culottes', 'Crepe', 899, 1199]]],
  ['Jeans', 'Everyday denim', 'jeans', ['26', '28', '30', '32', '34'], ['Five pockets', 'Machine wash'], [
    ['High Rise Skinny Jeans', 'Denim', 1299, 1799], ['Straight Fit Jeans', 'Denim', 1399, 1899], ['Wide Leg Jeans', 'Denim', 1499, 1999],
    ['Mom Fit Jeans', 'Denim', 1399, 1899], ['Bootcut Jeans', 'Denim', 1299, 1799], ['Distressed Jeans', 'Denim', 1499, 2099],
    ['Cropped Jeans', 'Denim', 1199, 1699]], DENIM],
  ['Skirts', 'Twirl-ready', 'skirt', STD, ['Elastic waist', 'Hand wash'], [
    ['Pleated Midi Skirt', 'Georgette', 999, 1399], ['A-Line Skirt', 'Cotton', 799, 1099], ['Flared Maxi Skirt', 'Rayon', 1099, 1499],
    ['Denim Skirt', 'Denim', 899, 1299], ['Tiered Skirt', 'Cotton', 949, 1299], ['Satin Slip Skirt', 'Satin', 1199, 1599],
    ['Printed Wrap Skirt', 'Rayon', 899, 1199]]],
  ['Dupattas', 'The finishing touch', 'dupatta', FREE, ['2.25 m length', 'Dry clean only'], [
    ['Banarasi Dupatta', 'Silk', 999, 1499], ['Phulkari Dupatta', 'Cotton', 899, 1299], ['Chiffon Dupatta', 'Chiffon', 499, 799],
    ['Net Embroidered Dupatta', 'Net', 799, 1199], ['Bandhani Dupatta', 'Georgette', 699, 999], ['Organza Dupatta', 'Organza', 749, 1099],
    ['Chanderi Dupatta', 'Chanderi', 649, 949]]],
  ['Jackets & Shrugs', 'Layer it up', 'shrug', STD, ['Open front', 'Regular fit', 'Hand wash'], [
    ['Embroidered Ethnic Jacket', 'Silk', 1499, 1999], ['Cotton Shrug', 'Cotton', 699, 999], ['Denim Jacket', 'Denim', 1799, 2499],
    ['Long Kimono Shrug', 'Georgette', 999, 1399], ['Velvet Jacket', 'Velvet', 1999, 2699], ['Knit Shrug', 'Acrylic', 799, 1099],
    ['Printed Nehru Jacket', 'Cotton', 1199, 1599]]],
  ['Nightwear', 'Sleep in comfort', 'nighty', STD, ['Soft and breathable', 'Relaxed fit', 'Machine wash'], [
    ['Cotton Night Suit', 'Cotton', 899, 1299], ['Printed Nighty', 'Cotton', 699, 999], ['Satin Night Suit', 'Satin', 1299, 1799],
    ['Kaftan Nightwear', 'Rayon', 799, 1099], ['Pyjama Set', 'Cotton', 999, 1399], ['Long Night Gown', 'Rayon', 849, 1199],
    ['Shorts Night Set', 'Cotton', 699, 999]]],
];

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
  await remove();
  let count = 0;
  for (const [ci, [name, tagline, type, sizes, details, products, palette = PAL]] of SECTIONS.entries()) {
    const n = palette.length;
    const icon = palette[(ci * 5) % n];
    let cat = await Category.findOne({ slug: slugify(name) });
    if (!cat) cat = await Category.create({ name, tagline, image: categoryImage(type, icon[1], icon[2]), order: ci, isDemo: true });
    else if (!cat.image) { cat.image = categoryImage(type, icon[1], icon[2]); await cat.save(); }

    const docs = products.map(([pname, fabric, price, mrp], pi) => {
      const a = palette[(ci * 5 + pi * 3) % n];
      const b = palette[(ci * 5 + pi * 3 + Math.ceil(n / 2)) % n];
      const colors = a[0] === b[0] ? [a] : [a, b];
      return {
        name: pname, fabric, price, mrp, sizes, isDemo: true, category: cat._id,
        stock: 6 + ((ci * 7 + pi * 5) % 20),
        isTrending: (ci + pi) % 6 === 0,
        details: [fabric, ...details],
        description: 'Demo product. Replace this text, the images and the price from the admin panel.',
        colors: colors.map(([cn, hex]) => ({ name: cn, hex })),
        images: colors.map(([, hex, accent]) => productImage(type, hex, accent)),
      };
    });
    for (const d of docs) await Product.create(d); // one by one so each gets a unique slug
    count += docs.length;
  }
  await Banner.create({
    eyebrow: 'New collection', title: 'Elegant ethnic wear', subtitle: 'For every occasion', link: '/shop', order: 0, isDemo: true,
    image: bannerImage([['saree', '#F6DCE5', '#D4A437'], ['lehenga', '#FFFFFF', '#D4A437'], ['kurti', '#FBEFF3', '#C2185B']]),
  });
  await Banner.create({
    eyebrow: 'Festive edit', title: 'Shararas, gowns and suits', subtitle: 'Ready to wear, ready to celebrate', link: '/shop/sharara-sets', order: 1, isDemo: true,
    image: bannerImage([['sharara', '#FFFFFF', '#D4A437'], ['gown', '#F6DCE5', '#D4A437'], ['suit', '#FBEFF3', '#C2185B']]),
  });
  console.log(`Added ${count} demo products in ${SECTIONS.length} sections and 2 banners`);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (process.argv.includes('--remove')) await remove(); else await seed();
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
