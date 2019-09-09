const app = require('./app');
const mongoose = require('./config/mongoose');
const passport = require('passport');
const strategies = require('./config/passport');
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const error = require('./middlewares/error');

// open mongoose connection
mongoose.connect();

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);
app.use(error.handler);

const main = async () => {
    await app.listen(8080);
    console.log('Server run on port 300')
}

main();