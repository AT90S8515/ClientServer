// Environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000;

// load .ENV file to global process.env
require('dotenv').config();

// Load global functions
require('./helpers/response');

// Requires
const bodyparser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('./helpers/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const {auth, strategy} = require('./middleware/passport');

// Require routes
const api = require('./api');

// Mongoose setup
mongoose.connect(process.env.MONGOOSE_URI);

// Set passport strategy
passport.use(strategy);

// Server setup
const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(morgan("combined", {"stream": logger.stream}));
app.use(passport.initialize());

// Set Routes
app.use('/api', api);
// FOR TESTING ONLY, test your token
app.get('/authTest', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token validated correctly',
    token: req.user
  });
});

// Start server
app.listen(process.env.PORT, () => {
  logger.info(`Application running in ${process.env.NODE_ENV} on port ${process.env.PORT}`);
  logger.info(`Ctrl + C to shut down`);
});
