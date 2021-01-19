const jwt = require('jsonwebtoken');
const { ErrorAuth } = require('../errors/errors');
const { DEV_SECRET } = require('../configs/config');
const { AUTH } = require('../configs/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorAuth(AUTH);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
    );
  } catch (e) {
    const err = new ErrorAuth(AUTH);
    next(err);
  }

  req.user = payload;

  next();
};
