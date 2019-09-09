/* eslint-disable max-len */
/* eslint-disable no-plusplus */
const httpStatus = require('http-status');
const Product = require('../models/product.model');
const { omit } = require('lodash');

/**
 * Create new product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(httpStatus.CREATED);
    res.json(savedProduct.transform());
  } catch (error) {
    next(Product.checkDuplicateName(error));
  }
};

exports.load = async (req, res, next, id) => {
  try {
    const product = await Product.get(id);
    req.locals = { product };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get product list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query;
    if (query.name) {
      query.name = new RegExp(query.name, 'i');
    } else if (query.category) {
      query.category = new RegExp(query.category, 'i');
    }

    const totalProducts = await Product.list({ query, perPage: 0 });
    const products = await Product.list(query);
    const transformedProducts = products.map(product => product.transform());
    res.json({ data: transformedProducts, totals: query.name || query.category ? products.length : totalProducts.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing product
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { product } = req.locals;
    const newProduct = new Product(req.body);
    const newProductObject = omit(newProduct.toObject(), '_id');

    await product.update(newProductObject, { override: true, upsert: true });
    const savedProduct = await Product.findById(product._id);

    res.json(savedProduct.transform());
  } catch (error) {
    next(Product.checkDuplicateEmail(error));
  }
};

/**
 * Update existing product
 * @public
 */
exports.update = (req, res, next) => {
  const updatedProduct = omit(req.body);
  const product = Object.assign(req.locals.product, updatedProduct);

  product.save()
    .then(savedProduct => res.json(savedProduct.transform()))
    .catch(e => next(e));
};

/**
 * Get product
 * @public
 */
exports.get = (req, res) => res.json(req.locals.product.transform());

/**
 * Delete product
 * @public
 */
exports.remove = (req, res, next) => {
  const { product } = req.locals;

  product.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
