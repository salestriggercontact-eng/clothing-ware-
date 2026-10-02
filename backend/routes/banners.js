const crud = require('../utils/crud');
module.exports = crud(require('../models/Banner'), { sort: { order: 1, createdAt: -1 } });
