const crud = require('../utils/crud');
const ah = require('../utils/ah');
const applyCoupon = require('../utils/coupon');
const { protect } = require('../middleware/auth');

module.exports = crud(require('../models/Coupon'), {
  publicFilter: () => ({ isActive: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }),
  extend: (r) => {
    r.post('/validate', protect, ah(async (req, res) => {
      try {
        const { coupon, discount } = await applyCoupon(req.body.code || '', Number(req.body.subtotal) || 0);
        res.json({ code: coupon.code, discount, description: coupon.description });
      } catch (e) { res.status(400).json({ message: e.message }); }
    }));
  },
});
