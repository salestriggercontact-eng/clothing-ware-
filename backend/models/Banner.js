const mongoose = require('mongoose');
const s = new mongoose.Schema({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  buttonText: { type: String, default: 'Shop now' },
  link: { type: String, default: '/shop' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Banner', s);
