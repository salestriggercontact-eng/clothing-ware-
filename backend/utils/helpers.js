exports.slugify = (s = '') =>
  s.toString().toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
exports.escRx = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
