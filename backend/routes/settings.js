const r = require('express').Router();
const ah = require('../utils/ah');
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/auth');

const get = async () => (await Setting.findOne({ key: 'store' })) || Setting.create({ key: 'store' });
// delivery rules come from server env so cart and order totals always match
const withDelivery = (s) => ({
  ...s.toObject(),
  freeDeliveryMin: Number(process.env.FREE_DELIVERY_MIN ?? 999),
  deliveryFee: Number(process.env.DELIVERY_FEE ?? 79),
});

r.get('/', ah(async (req, res) => res.json(withDelivery(await get()))));
r.put('/', protect, admin, ah(async (req, res) => {
  const s = await get();
  const { _id, key, createdAt, updatedAt, __v, freeDeliveryMin, deliveryFee, ...body } = req.body;
  Object.assign(s, body);
  await s.save();
  res.json(withDelivery(s));
}));

module.exports = r;
