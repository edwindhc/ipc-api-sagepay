const Joi = require('joi');


module.exports = {

  // GET /products
  listProduts: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      stock: Joi.string(),
    },
  },

  // POST /products
  createProduct: {
    body: {
      name: Joi.string().max(128),
      price: Joi.number().min(1),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /products/:productId
  replaceProduct: {
    body: {
      name: Joi.string().max(128),
    },
    params: {
      productId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /products/:productId
  updateProduct: {
    body: {
      name: Joi.string().max(128),
    },
    params: {
      productId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
