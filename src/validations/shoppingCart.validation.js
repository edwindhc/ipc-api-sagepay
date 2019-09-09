const Joi = require('joi');

module.exports = {
  // GET /products
  listProduts: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      productId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

}