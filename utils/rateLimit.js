const rateLimit = require('express-rate-limit');
const { RATELIMWIN, RATELIMMAX } = require('../configs/config');
const { RATE_LIMIT } = require('../configs/constants');

const limiter = rateLimit({
  windowMs: RATELIMWIN,
  max: RATELIMMAX,
  message: RATE_LIMIT,
});

module.exports = limiter;
