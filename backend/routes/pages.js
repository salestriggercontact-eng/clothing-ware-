const r = require('express').Router();
const ah = require('../utils/ah');
const Page = require('../models/Page');
const { protect, admin } = require('../middleware/auth');
const { DEFAULT_PAGES } = require('../utils/defaultPages');

r.get('/', ah(async (req, res) => res.json(await Page.find({ isActive: true }).select('title slug showInFooter order').sort({ order: 1 }))));
r.get('/admin/all', protect, admin, ah(async (req, res) => res.json(await Page.find().sort({ order: 1 }))));

// Restore one page's original template text
r.post('/:id/reset', protect, admin, ah(async (req, res) => {
  const p = await Page.findById(req.params.id);
  const def = p && DEFAULT_PAGES.find((d) => d.slug === p.slug);
  if (!def) return res.status(400).json({ message: 'This page has no default template' });
  p.content = def.content; p.title = def.title;
  await p.save();
  res.json(p);
}));

r.get('/:slug', ah(async (req, res) => {
  const p = await Page.findOne({ slug: req.params.slug, isActive: true });
  if (!p) return res.status(404).json({ message: 'Page not found' });
  res.json(p);
}));
r.post('/', protect, admin, ah(async (req, res) => res.status(201).json(await Page.create(req.body))));
r.put('/:id', protect, admin, ah(async (req, res) => {
  const p = await Page.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Page not found' });
  const { _id, createdAt, updatedAt, __v, ...body } = req.body;
  Object.assign(p, body);
  await p.save();
  res.json(p);
}));
r.delete('/:id', protect, admin, ah(async (req, res) => { await Page.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));

module.exports = r;
