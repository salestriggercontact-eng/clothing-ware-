const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, image: String, price: Number, mrp: Number, qty: Number, color: String, size: String,
  }],
  address: { name: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String },
  subtotal: Number,
  mrpTotal: Number,
  couponCode: { type: String, default: '' },
  couponDiscount: { type: Number, default: 0 },
  delivery: { type: Number, default: 0 },
  total: Number,
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  status: { type: String, enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
  trackingNote: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Order', s);
