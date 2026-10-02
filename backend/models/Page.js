const mongoose = require('mongoose');
const { slugify } = require('../utils/helpers');
const s = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, default: '' }, // simple markdown: ## heading, - bullet, **bold**, [text](/link)
  showInFooter: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
s.pre('validate', function () { if (!this.slug && this.title) this.slug = slugify(this.title); });
module.exports = mongoose.model('Page', s);
