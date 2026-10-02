const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  location: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Service', s);
