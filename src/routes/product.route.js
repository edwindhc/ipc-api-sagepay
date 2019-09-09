/* eslint-disable max-len */
const express = require('express');
const validate = require('express-validation');
const { listProduts, createProduct } = require('../validations/product.validation');
const controller = require('../controllers/product.controller');

const router = express.Router();
/**
 * Load product when API with productId route parameter is hit
 */
router.param('productId', controller.load);

router
  .route('/')
/**
   * @api {get} v1/product List Produts
   * @apiDescription Get a list of produts
   * @apiVersion 1.0.0
   * @apiName ListProducts
   * @apiGroup Product
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Product's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Produts per page
   * @apiParam  {String}             [name]       Product's name
   * @apiParam  {String}             [category]      Product's category
   * @apiParam  {String}             [price]      Product's price
   * @apiParam  {String}             [picture]      Product's picture
   *
   * @apiSuccess {Object[]} produts List of produts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated produts can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
*/
  .get(validate(listProduts), controller.list)
  /**
   * @api {post} v1/product Create Product
   * @apiDescription Create a new product
   * @apiVersion 1.0.0
   * @apiName CreateProduct
   * @apiGroup Product
   * @apiPermission logged
   *
   *
   * @apiParam  {String{..128}}      name    Product's name
   * @apiParam  {Number}      [stock]    Product's name
   * @apiParam  {String}      category    Product's category
   *
   * @apiSuccess (Created 201) {String}  id         Product's id
   * @apiSuccess (Created 201) {String}  name       Product's name
   * @apiSuccess (Created 201) {String}  category      Product's category
   * @apiSuccess (Created 201) {String}  price      Product's price
   * @apiSuccess (Created 201) {String}  picture      Product's picture
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated products can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createProduct), controller.create);

module.exports = router;
