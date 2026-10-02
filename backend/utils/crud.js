const express = require('express');
const ah = require('./ah');
const { protect, admin } = require('../middleware/auth');

// Generic CRUD router: public list + admin create/update/delete
module.exports = (Model, { publicFilter = { isActive: true }, sort = { createdAt: -1 }, beforeDelete, extend } = {}) => {
  const r = express.Router();
  if (extend) extend(r);
  r.get('/', ah(async (req, res) => {
    const f = typeof publicFilter === 'function' ? publicFilter() : publicFilter;
    res.json(await Model.find(f).sort(sort));
  }));
  r.get('/admin/all', protect, admin, ah(async (req, res) => res.json(await Model.find().sort(sort))));
  r.post('/', protect, admin, ah(async (req, res) => res.status(201).json(await Model.create(req.body))));
  r.put('/:id', protect, admin, ah(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Item not found' });
    const { _id, createdAt, updatedAt, __v, ...body } = req.body;
    Object.assign(doc, body);
    await doc.save();
    res.json(doc);
  }));
  r.delete('/:id', protect, admin, ah(async (req, res) => {
    if (beforeDelete) {
      const msg = await beforeDelete(req.params.id);
      if (msg) return res.status(400).json({ message: msg });
    }
    await Model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  }));
  return r;
};
