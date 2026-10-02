const mongoose = require('mongoose');
const { slugify } = require('../utils/helpers');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
}, { timestamps: true });

const s = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  fabric: { type: String, trim: true, default: '' },
  description: { type: String, default: '' },
  details: [String],
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, min: 0, default: 0 },
  images: [String],
  colors: [{ name: String, hex: String }],
  sizes: [String],
  stock: { type: Number, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isTrending: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

s.virtual('discount').get(function () {
  return this.mrp > this.price ? Math.round(((this.mrp - this.price) / this.mrp) * 100) : 0;
});
s.pre('validate', function () {
  if (!this.slug) this.slug = `${slugify(this.name)}-${Date.now().toString(36)}`;
});
s.index({ category: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Product', s);
