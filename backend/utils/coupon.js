const Coupon = require('../models/Coupon');
// returns { coupon, discount } or throws Error with user-facing message
module.exports = async (code, subtotal) => {
  const c = await Coupon.findOne({ code: String(code).trim().toUpperCase(), isActive: true });
  if (!c) throw new Error('This coupon code is not valid');
  if (c.expiresAt && c.expiresAt < new Date()) throw new Error('This coupon has expired');
  if (subtotal < (c.minOrder || 0)) throw new Error(`Add items worth ₹${c.minOrder} or more to use this coupon`);
  let discount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value;
  if (c.type === 'percent' && c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
  discount = Math.min(discount, subtotal);
  return { coupon: c, discount };
};
