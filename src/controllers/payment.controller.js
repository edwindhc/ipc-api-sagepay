const httpStatus = require('http-status');
const Payment = require('../models/payment.model');
const { omit } = require('lodash');
const { vendorName, integrationKey, integrationPassword } = require('../config/vars');
const axios = require('axios')

/**
 * Create new payment
 * @public
 */
exports.create = async (req, res, next) => {
  try {
   
    const credentials = Buffer.from(`${integrationKey}:${integrationPassword}`).toString('base64')
    let config = {
      headers: {Authorization: `Basic ${credentials}`}
    };
    let data = {}
    let request = await axios.post('https://pi-test.sagepay.com/api/v1/merchant-session-keys', {vendorName}, config)
    if (request.status) data = request.data
    const merchantHeader = {
        headers: {Authorization: `Bearer ${data.merchantSessionKey}`}
    }
    const cardDetails = {
        cardholderName: req.body.cardholderName,
        cardNumber: req.body.cardNumber,
        expiryDate: req.body.expiryDate,
        securityCode: req.body.securityCode
    };

    let cardIdentifier = await axios.post(`https://pi-test.sagepay.com/api/v1/card-identifiers`,{cardDetails}, merchantHeader )

    const objectTransaction = {
        transactionType: "Payment",
        paymentMethod: {
            card:{
                merchantSessionKey: `${data.merchantSessionKey}`,
                cardIdentifier: cardIdentifier.data.cardIdentifier,
            }
        },
        vendorTxCode: `${Math.floor(Math.random() * 10000000000000)}`,
        amount: req.body.price,
        currency: "GBP",
        description: "Demo transaction",
        apply3DSecure: "UseMSPSetting",
        customerFirstName: "Sam",
        customerLastName: "Jones",
        billingAddress: {
            address1: "407 St. John Street",
            city: "London",
            postalCode: "EC1V 4AB",
            country: "GB"
        },
        entryMethod: "Ecommerce"
    }

    let transaction = await axios.post('https://pi-test.sagepay.com/api/v1/transactions', objectTransaction, config)

    await axios.get(`https://test.sagepay.com/mpitools/accesscontroler?action=${transaction.data.paReq}`, config)
    console.log(transaction.data, ' securesecuresecuresecuresecure')
    console.log(req.body, ' BODY')
    const fullData = {
        paymentMethod: {
            card:{
                cardDetails
            }
        },
        transactionId: transaction.data.transactionId,
        price: req.body.price,
        currency: objectTransaction.currency,
        description: objectTransaction.description,
        transactionType: objectTransaction.transactionType,
        userId: req.body.userId
    }
    /* console.log(req) */
    const payment = new Payment(fullData);
    const savedPayment = await payment.save();
    res.status(httpStatus.CREATED);
    res.json(savedPayment.transform());
  } catch (error) {
    next(error);
  }
};

exports.load = async (req, res, next, id) => {
  try {
    const payment = await Payment.get(id);
    req.locals = { payment };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get payment list
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
    const totalPayments = await Payment.list({ query, perPage: 0 });
    const payments = await Payment.list(query);
    const transformedPayments = payments.map(payment => payment.transform());
    res.json({ data: transformedPayments, totals: totalPayments.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing payment
 * @public
 */
exports.update = (req, res, next) => {
  const updatedPayment = omit(req.body);
  const payment = Object.assign(req.locals.payment, updatedPayment);

  payment.save()
    .then(savedPayment => res.json(savedPayment.transform()))
    .catch(e => next(e));
};

/**
 * Get payment
 * @public
 */
exports.get = (req, res) => res.json(req.locals.payment.transform());

/**
 * Delete payment
 * @public
 */
exports.remove = (req, res, next) => {
  const { payment } = req.locals;

  payment.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
