const error = require('express').Router();
const { NOT_FOUND } = require('../configs/constants');
const { ErrorNotFound } = require('../errors/errors');

error.all('/', () => {
  throw new ErrorNotFound(NOT_FOUND);
});

module.exports = error;
