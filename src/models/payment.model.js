const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

const paymentSchema = new Schema({
    paymentMethod: {
    type: Object,
    card: {}
  },
  transactionId: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  transactionType:{
    type: String,
    trim: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'done'
  },
},
{
  timestamps: true,
});

/**
 * Methods
 */
paymentSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'paymentMethod', 'transactionId', 'price', 'createdAt', 'userId', 'status', 'description'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
paymentSchema.statics = {
  /**
   * Get payment
   *
   * @param {ObjectId} id - The objectId of payment.
   * @returns {Promise<Payment, APIError>}
   */
  async get(id) {
      let payment;

      if (mongoose.Types.ObjectId.isValid(id)) {
        payment = await this.findById(id).exec();
      }
      if (payment) {
        return payment;
      }

      throw new APIError({
        message: 'Payment does not exist',
        status: httpStatus.NOT_FOUND,
      });
  },

  /**
   * List payments in descending payment of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of payments to be skipped.
   * @param {number} limit - Limit number of payments to be returned.
   * @returns {Promise<Payment[]>}
   */
  list({
    page = 1, perPage = 30, transactionId, paymentMethod, userId, createdAt, status, price, description,
  }) {
    const options = omitBy({
      transactionId, paymentMethod, userId, createdAt, status, price, description
    }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Payment', paymentSchema);