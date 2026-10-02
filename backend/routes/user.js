const r = require('express').Router();
const ah = require('../utils/ah');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

r.get('/wishlist', protect, ah(async (req, res) => {
  const u = await User.findById(req.user._id).populate({ path: 'wishlist', match: { isActive: true }, select: '-reviews' });
  res.json(u.wishlist.filter(Boolean));
}));

r.post('/wishlist/:productId', protect, ah(async (req, res) => {
  const u = await User.findById(req.user._id);
  const id = req.params.productId;
  const has = u.wishlist.some((x) => String(x) === id);
  u.wishlist = has ? u.wishlist.filter((x) => String(x) !== id) : [...u.wishlist, id];
  await u.save();
  res.json({ wishlist: u.wishlist, added: !has });
}));

module.exports = r;
