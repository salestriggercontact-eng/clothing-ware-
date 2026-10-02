const crud = require('../utils/crud');
const Category = require('../models/Category');
const Product = require('../models/Product');
module.exports = crud(Category, {
  sort: { order: 1, name: 1 },
  beforeDelete: async (id) => {
    const n = await Product.countDocuments({ category: id });
    return n ? `This category has ${n} product(s). Move or delete them first.` : null;
  },
});
