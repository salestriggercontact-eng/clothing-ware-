const r = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ah = require('../utils/ah');
const { protect, admin } = require('../middleware/auth');

const useCloud = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
let cloudinary;
if (useCloud) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary not set: images will be saved on local disk (deleted on every Render redeploy).');
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, f, cb) => cb(null, /^image\/(jpe?g|png|webp|gif|avif)$/.test(f.mimetype)),
});

const toCloud = (buf) => new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream({ folder: 'luxeher', resource_type: 'image' }, (e, r) => (e ? reject(e) : resolve(r.secure_url))).end(buf);
});

r.post('/', protect, admin, upload.array('images', 10), ah(async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'Choose JPG, PNG or WEBP images under 5 MB' });
  const urls = [];
  for (const f of req.files) {
    if (useCloud) urls.push(await toCloud(f.buffer));
    else {
      const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(f.originalname).toLowerCase() || '.jpg'}`;
      fs.writeFileSync(path.join(__dirname, '..', 'uploads', name), f.buffer);
      urls.push(`/uploads/${name}`);
    }
  }
  res.json({ urls });
}));

module.exports = r;
