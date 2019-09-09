/* eslint-disable max-len */
const express = require('express');
const { authorize, ADMIN } = require('../middlewares/auth.middleware');

const controller = require('../controllers/payment.controller');

const router = express.Router();
/**
 * Load payment when API with paymentId route parameter is hit
 */
router.param('paymentId', controller.load);

router
  .route('/')
/**
   * @api {get} v1/payment List Produts
   * @apiDescription Get a list of payment
   * @apiVersion 1.0.0
   * @apiName ListOrders
   * @apiGroup Order
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Order's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Produts per page
   * @apiParam  {Array}             [cart]       Cart or Products
   * @apiParam  {Number}             [total]      Order's total
   * @apiParam  {String= pending, confirmed}             [status]      Order's status
   *
   * @apiSuccess {Object[]} payment List of payment.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated payment can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
*/
  .get(controller.list)
  /**
   * @api {post} v1/payment Create Order
   * @apiDescription Create a new payment
   * @apiVersion 1.0.0
   * @apiName CreateOrder
   * @apiGroup Order
   * @apiPermission logged
   *
   *
   * @apiParam  {Array}             [cart]       Cart or Products
   * @apiParam  {Number}             [total]      Order's total
   * @apiParam  {String=pending,confirmed}             [status]      Order's status
   *
   * @apiSuccess (Created 201) {String}  id         Order's id
   * @apiSuccess (Created 201) {Array}  cart       Cart Products
   * @apiSuccess (Created 201) {Number}  total      Total Order
   * @apiSuccess (Created 201) {String=pending,confirmed}  status     Status Order
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated payments can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(controller.create);
router
  .route('/:paymentId')
/**
   * @api {get} v1/payment/:id Get Order
   * @apiDescription Get payment information
   * @apiVersion 1.0.0
   * @apiName GetOrder
   * @apiGroup Order
   * @apiPermission payment
   *
   * @apiHeader {String} Authorization   Order's access token
   *
   * @apiParam  {Array}             [cart]       Cart or Products
   * @apiParam  {Number}             [total]      Order's total
   * @apiParam  {String=pending,confirmed}             [status]      Order's status
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated payments can access the data
   * @apiError (Forbidden 403)    Forbidden    Only payment with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Order does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {patch} v1/payment/:id Update Order
   * @apiDescription Update some fields of a payment document
   * @apiVersion 1.0.0
   * @apiName UpdateOrder
   * @apiGroup Order
   * @apiPermission payment
   *
   * @apiHeader {String} Authorization   Order's access token
   *
   * @apiParam  {Array}             [cart]       Cart or Products
   * @apiParam  {Number}             [total]      Order's total
   * @apiParam  {String=pending,confirmed}             [status]      Order's status
   * (You must be an admin to change the payment's role)
   *
   * @apiSuccess (Created 201) {String}  id         Order's id
   * @apiSuccess (Created 201) {Array}  cart       Cart Products
   * @apiSuccess (Created 201) {Number}  total      Total Order
   * @apiSuccess (Created 201) {String = pending,confirmed}  status     Status Order
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated payments can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only payment with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Order does not exist
   */
  .patch(authorize(ADMIN), controller.update)
  /**
   * @api {delete} v1/payment/:id Delete Order
   * @apiDescription Delete a payment
   * @apiVersion 1.0.0
   * @apiName DeleteOrder
   * @apiGroup Order
   * @apiPermission payment
   *
   * @apiHeader {String} Authorization   Order's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated payments can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only payment with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Order does not exist
   */
  .delete(authorize(), controller.remove);
module.exports = router;
