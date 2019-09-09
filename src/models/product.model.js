/* eslint-disable max-len */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Product Schema
 * @private
 */

const categories = ["Baby", "Movies", "Shoes", "Books", "Electronics","Computers", "Kids"];

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 10,
    default: 0,
  },
  picture: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: categories,
    /* required: true, */
  },
  description: {
      type: String,
      trim: true
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});
/**
 * Methods
 */
productSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'stock', 'picture', 'category', 'price', 'createdAt', 'userId'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
productSchema.statics = {
  /**
   * Get product
   *
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  async get(id) {
      let product;

      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await this.findById(id).exec();
      }
      if (product) {
        return product;
      }

      throw new APIError({
        message: 'Product does not exist',
        status: httpStatus.NOT_FOUND,
      });
  },

  /**
   * List products in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of products to be skipped.
   * @param {number} limit - Limit number of products to be returned.
   * @returns {Promise<Product[]>}
   */
  list({
    page = 1, perPage = 30, name, stock, price, category, userId, createdAt,
  }) {
    const options = omitBy({
      name, stock, price, category, userId, createdAt,
    }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateName(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'name',
          location: 'body',
          messages: ['"name" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef Product
*/
module.exports = mongoose.model('Product', productSchema);
