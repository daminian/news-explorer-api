const { SERVER_ERROR } = require('../configs/constants');

const errorServer = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? SERVER_ERROR : message });
  next();
};
module.exports = errorServer;
