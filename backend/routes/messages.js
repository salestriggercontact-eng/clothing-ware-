const r = require('express').Router();
const ah = require('../utils/ah');
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/auth');

// simple in-memory rate limit: 5 messages per IP per hour
const hits = new Map();
r.post('/', ah(async (req, res) => {
  const now = Date.now();
  const list = (hits.get(req.ip) || []).filter((t) => now - t < 3600e3);
  if (list.length >= 5) return res.status(429).json({ message: 'Too many messages. Try again in an hour or call us.' });
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message || (!email && !phone)) return res.status(400).json({ message: 'Add your name, message and an email or phone number' });
  hits.set(req.ip, [...list, now]);
  await Message.create({ name, email, phone, subject, message });
  res.status(201).json({ ok: true });
}));
r.get('/admin/all', protect, admin, ah(async (req, res) => res.json(await Message.find().sort({ createdAt: -1 }).limit(500))));
r.put('/:id', protect, admin, ah(async (req, res) => res.json(await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }))));
r.delete('/:id', protect, admin, ah(async (req, res) => { await Message.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));

module.exports = r;
