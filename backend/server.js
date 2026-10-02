require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { ensureDefaultPages } = require('./utils/defaultPages');

const app = express();
app.set('trust proxy', 1);
const origins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/services', require('./routes/services'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/messages', require('./routes/messages'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(400).json({ message: `${Object.keys(err.keyValue)[0]} already exists` });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Each image must be under 5 MB' });
  res.status(500).json({ message: 'Server error. Try again.' });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(ensureDefaultPages)
  .then(() => app.listen(PORT, () => console.log(`API running on ${PORT}`)))
  .catch((e) => { console.error(e.message); process.exit(1); });
