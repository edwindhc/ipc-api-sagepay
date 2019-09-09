const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const userRoutes = require('./user.route');
const productRoutes = require('./product.route');
const paymentRoutes = require('./payment.route')
/* const { authorize, ADMIN, LOGGED_USER } = require('../middlewares/auth.middleware'); */

router.get('/', (req, res) => res.json({message: 'Hello world'}) );

router.route('/login')
/**
 * @api {post} /login Login
 * @apiDescription Login a new user
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.name       User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {String}  user.role       User's role
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
  .post(controller.login);
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/payments', paymentRoutes);



module.exports = router;