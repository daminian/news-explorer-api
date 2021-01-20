const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ErrorNotFound, ErrorConflict, ErrorRequest, ErrorAuth,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  INVALID_REQUEST, USER_NOT_FOUND, USER_ALREADY_EXISTS, ERROR_EMAIL_PASS,
} = require('../configs/constants');

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(USER_NOT_FOUND);
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (data.email === req.body.email) {
        throw new ErrorConflict(USER_ALREADY_EXISTS);
      }
    });

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      })
        .then((user) => {
          res.send({ email: user.email, name: user.name });
        })
        .catch((err) => {
          if (err.name === 'MongoError') {
            next(new ErrorConflict(USER_ALREADY_EXISTS));
          }
          if (err.name === 'ValidationError') {
            next(new ErrorRequest(INVALID_REQUEST));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrorAuth(ERROR_EMAIL_PASS);
      }
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.send({ token: jwtToken });
    })
    .catch((err) => {
      if (err) {
        next(new ErrorAuth(ERROR_EMAIL_PASS));
      } else {
        next(err);
      }
    });
};
