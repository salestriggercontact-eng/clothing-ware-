const r = require('express').Router();
const jwt = require('jsonwebtoken');
const ah = require('../utils/ah');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const pub = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, isPremium: u.isPremium, addresses: u.addresses, wishlist: u.wishlist });

r.post('/register', ah(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'This email is already registered. Log in instead.' });
  const u = await User.create({ name, email, phone, password });
  res.status(201).json({ token: sign(u._id), user: pub(u) });
}));

r.post('/login', ah(async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ message: 'Enter your email or phone and password' });
  const v = String(login).trim();
  const u = await User.findOne(v.includes('@') ? { email: v.toLowerCase() } : { phone: v });
  if (!u || !(await u.matchPassword(password))) return res.status(401).json({ message: 'Wrong email/phone or password' });
  if (u.isBlocked) return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
  res.json({ token: sign(u._id), user: pub(u) });
}));

r.get('/me', protect, (req, res) => res.json(pub(req.user)));

r.put('/me', protect, ah(async (req, res) => {
  const u = await User.findById(req.user._id);
  const { name, phone, addresses, password, currentPassword } = req.body;
  if (name !== undefined) u.name = name;
  if (phone !== undefined) u.phone = phone;
  if (Array.isArray(addresses)) u.addresses = addresses;
  if (password) {
    if (!(await u.matchPassword(currentPassword || ''))) return res.status(400).json({ message: 'Current password is wrong' });
    u.password = password;
  }
  await u.save();
  res.json(pub(u));
}));

module.exports = r;
