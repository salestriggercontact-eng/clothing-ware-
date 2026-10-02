const r = require('express').Router();
const ah = require('../utils/ah');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/auth');
const { escRx } = require('../utils/helpers');

r.use(protect, admin);

r.get('/stats', ah(async (req, res) => {
  const [users, products, orders, pending, rev, lowStock, recentOrders, upcoming, newMessages] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['Placed', 'Confirmed'] } }),
    Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.find({ stock: { $lte: 5 } }).select('name stock images').sort({ stock: 1 }).limit(10),
    Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(8),
    Appointment.countDocuments({ status: 'Upcoming' }),
    Message.countDocuments({ status: 'New' }),
  ]);
  res.json({ users, products, orders, pending, revenue: rev[0]?.total || 0, lowStock, recentOrders, upcoming, newMessages });
}));

r.get('/users', ah(async (req, res) => {
  const f = {};
  if (req.query.q) { const rx = new RegExp(escRx(req.query.q), 'i'); f.$or = [{ name: rx }, { email: rx }, { phone: rx }]; }
  res.json(await User.find(f).select('-password -wishlist').sort({ createdAt: -1 }).limit(300));
}));

r.put('/users/:id', ah(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot change your own admin account here' });
  const { isPremium, isBlocked, role } = req.body;
  const upd = {};
  if (isPremium !== undefined) upd.isPremium = !!isPremium;
  if (isBlocked !== undefined) upd.isBlocked = !!isBlocked;
  if (role && ['user', 'admin'].includes(role)) upd.role = role;
  const u = await User.findByIdAndUpdate(req.params.id, upd, { new: true }).select('-password -wishlist');
  res.json(u);
}));

module.exports = r;
