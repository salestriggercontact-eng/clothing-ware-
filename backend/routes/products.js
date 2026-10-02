const r = require('express').Router();
const ah = require('../utils/ah');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { escRx } = require('../utils/helpers');

const SORTS = { new: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, popular: { sold: -1 } };

async function buildFilter(q, onlyActive = true) {
  const f = onlyActive ? { isActive: true } : {};
  if (q.category && q.category !== 'all') {
    const c = await Category.findOne({ slug: q.category });
    if (!c) return null;
    f.category = c._id;
  }
  if (q.fabric) f.fabric = new RegExp(`^${escRx(q.fabric)}$`, 'i');
  if (q.q) { const rx = new RegExp(escRx(q.q), 'i'); f.$or = [{ name: rx }, { fabric: rx }, { description: rx }]; }
  if (q.trending === 'true') f.isTrending = true;
  return f;
}

r.get('/', ah(async (req, res) => {
  const f = await buildFilter(req.query);
  if (!f) return res.json({ items: [], total: 0, pages: 0, page: 1 });
  const lim = Math.min(parseInt(req.query.limit) || 20, 60);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const [items, total] = await Promise.all([
    Product.find(f).select('-reviews').populate('category', 'name slug')
      .sort(SORTS[req.query.sort] || SORTS.new).skip((page - 1) * lim).limit(lim),
    Product.countDocuments(f),
  ]);
  res.json({ items, total, pages: Math.ceil(total / lim), page });
}));

r.get('/fabrics', ah(async (req, res) => {
  const f = await buildFilter({ category: req.query.category });
  if (!f) return res.json([]);
  const list = (await Product.distinct('fabric', f)).filter(Boolean).sort();
  res.json(list);
}));

r.get('/admin/all', protect, admin, ah(async (req, res) => {
  const f = await buildFilter(req.query, false) || {};
  res.json(await Product.find(f).select('-reviews').populate('category', 'name slug').sort({ createdAt: -1 }));
}));

r.get('/admin/:id', protect, admin, ah(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
}));

r.get('/:slug', ah(async (req, res) => {
  const p = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!p) return res.status(404).json({ message: 'This product is not available' });
  res.json(p);
}));

const clean = (b) => {
  const { _id, reviews, rating, numReviews, sold, slug, createdAt, updatedAt, __v, discount, id, ...rest } = b;
  return rest;
};

r.post('/', protect, admin, ah(async (req, res) => res.status(201).json(await Product.create(clean(req.body)))));

r.put('/:id', protect, admin, ah(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  Object.assign(p, clean(req.body));
  await p.save();
  res.json(p);
}));

r.delete('/:id', protect, admin, ah(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

// Only customers with a delivered order of this product can review
r.post('/:id/reviews', protect, ah(async (req, res) => {
  const rating = Number(req.body.rating);
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: 'Choose a rating from 1 to 5' });
  const bought = await Order.exists({ user: req.user._id, status: 'Delivered', 'items.product': req.params.id });
  if (!bought) return res.status(403).json({ message: 'You can review this item after it is delivered to you' });
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  const existing = p.reviews.find((x) => String(x.user) === String(req.user._id));
  if (existing) { existing.rating = rating; existing.comment = req.body.comment || ''; }
  else p.reviews.push({ user: req.user._id, name: req.user.name, rating, comment: req.body.comment || '' });
  p.numReviews = p.reviews.length;
  p.rating = Math.round((p.reviews.reduce((a, x) => a + x.rating, 0) / p.numReviews) * 10) / 10;
  await p.save();
  res.json(p);
}));

module.exports = r;
