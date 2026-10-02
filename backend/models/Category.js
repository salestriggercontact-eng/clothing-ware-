const mongoose = require('mongoose');
const { slugify } = require('../utils/helpers');
const s = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  tagline: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });
s.pre('validate', function () { if (this.isModified('name')) this.slug = slugify(this.name); });
module.exports = mongoose.model('Category', s);
