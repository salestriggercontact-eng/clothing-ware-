// Usage: set ADMIN_EMAIL / ADMIN_PASSWORD in .env, then: npm run create-admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Admin' } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  let u = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (u) { u.role = 'admin'; u.password = ADMIN_PASSWORD; await u.save(); console.log('Existing user promoted to admin, password reset'); }
  else { await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }); console.log('Admin created'); }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
