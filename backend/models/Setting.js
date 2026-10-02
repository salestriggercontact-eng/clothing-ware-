const mongoose = require('mongoose');
// Single document holding store details used across the site and in policy pages
const s = new mongoose.Schema({
  key: { type: String, default: 'store', unique: true },
  storeName: { type: String, default: 'LuxeHer' },
  legalName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  address: { type: String, default: '' },
  gstin: { type: String, default: '' },
  hours: { type: String, default: 'Monday to Saturday, 10 AM to 7 PM' },
  grievanceName: { type: String, default: '' },
  grievanceEmail: { type: String, default: '' },
  returnDays: { type: Number, default: 7 },
  dispatchDays: { type: String, default: '1 to 2' },
  deliveryDays: { type: String, default: '4 to 7' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Setting', s);
