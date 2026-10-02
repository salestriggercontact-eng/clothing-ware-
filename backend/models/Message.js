const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  subject: { type: String, trim: true, default: '' },
  message: { type: String, required: true, maxlength: 3000 },
  status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
}, { timestamps: true });
module.exports = mongoose.model('Message', s);
