const r = require('express').Router();
const ah = require('../utils/ah');
const Order = require('../models/Order');
const Product = require('../models/Product');
const applyCoupon = require('../utils/coupon');
const { protect, admin } = require('../middleware/auth');

const restock = (items) => Promise.all(items.map((i) =>
  Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty, sold: -i.qty } })));

r.post('/', protect, ah(async (req, res) => {
  const { items, address, couponCode } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Your cart is empty' });
  const a = address || {};
  if (!a.name || !a.phone || !a.line1 || !a.city || !a.pincode) return res.status(400).json({ message: 'Add a complete delivery address' });

  const prods = await Product.find({ _id: { $in: items.map((i) => i.product) }, isActive: true });
  const map = new Map(prods.map((p) => [String(p._id), p]));
  const lines = [];
  let subtotal = 0, mrpTotal = 0;
  for (const i of items) {
    const p = map.get(String(i.product));
    if (!p) return res.status(400).json({ message: 'An item in your cart is no longer available. Remove it and try again.' });
    const qty = Math.max(1, parseInt(i.qty) || 1);
    lines.push({ product: p._id, name: p.name, image: p.images[0] || '', price: p.price, mrp: p.mrp || p.price, qty, color: i.color || '', size: i.size || '' });
    subtotal += p.price * qty;
    mrpTotal += (p.mrp || p.price) * qty;
  }

  let couponDiscount = 0, code = '';
  if (couponCode) {
    try { const c = await applyCoupon(couponCode, subtotal); couponDiscount = c.discount; code = c.coupon.code; }
    catch (e) { return res.status(400).json({ message: e.message }); }
  }

  // reserve stock atomically; roll back if any line fails
  const done = [];
  for (const l of lines) {
    const ok = await Product.updateOne({ _id: l.product, stock: { $gte: l.qty } }, { $inc: { stock: -l.qty, sold: l.qty } });
    if (!ok.modifiedCount) {
      await restock(done);
      return res.status(400).json({ message: `Not enough stock for ${l.name}. Reduce quantity and try again.` });
    }
    done.push(l);
  }

  const freeMin = Number(process.env.FREE_DELIVERY_MIN ?? 999);
  const fee = Number(process.env.DELIVERY_FEE ?? 79);
  const delivery = subtotal >= freeMin ? 0 : fee;
  const order = await Order.create({
    user: req.user._id, items: lines, address: a, subtotal, mrpTotal,
    couponCode: code, couponDiscount, delivery, total: subtotal - couponDiscount + delivery, paymentMethod: 'COD',
  });
  res.status(201).json(order);
}));

r.get('/mine', protect, ah(async (req, res) => res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }))));

r.get('/admin/all', protect, admin, ah(async (req, res) => {
  const f = req.query.status ? { status: req.query.status } : {};
  res.json(await Order.find(f).populate('user', 'name email phone').sort({ createdAt: -1 }).limit(500));
}));

r.get('/:id', protect, ah(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o || (String(o.user) !== String(req.user._id) && req.user.role !== 'admin')) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
}));

r.put('/:id/cancel', protect, ah(async (req, res) => {
  const o = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!o) return res.status(404).json({ message: 'Order not found' });
  if (!['Placed', 'Confirmed'].includes(o.status)) return res.status(400).json({ message: 'This order is already shipped and cannot be cancelled' });
  o.status = 'Cancelled';
  await o.save();
  await restock(o.items);
  res.json(o);
}));

r.put('/:id/status', protect, admin, ah(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  const { status, trackingNote, paymentStatus } = req.body;
  if (status && status !== o.status) {
    if (o.status === 'Cancelled') return res.status(400).json({ message: 'Cancelled orders cannot be reopened' });
    if (status === 'Cancelled') await restock(o.items);
    if (status === 'Delivered' && o.paymentMethod === 'COD') o.paymentStatus = 'Paid';
    o.status = status;
  }
  if (trackingNote !== undefined) o.trackingNote = trackingNote;
  if (paymentStatus) o.paymentStatus = paymentStatus;
  await o.save();
  res.json(await o.populate('user', 'name email phone'));
}));

module.exports = r;
