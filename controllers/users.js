const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ErrorNotFound, ErrorConflict, ErrorRequest, ErrorAuth,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (data.email === req.body.email) {
        throw new ErrorConflict('Данный пользователь уже зарегистрирован');
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
            next(new ErrorConflict('Данный пользователь уже зарегистрирован'));
          }
          if (err.name === 'ValidationError') {
            next(new ErrorRequest('Некорректные данные'));
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
        throw new ErrorAuth('Ведены неправильный email или пароль');
      }
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.send({ token: jwtToken });
    })
    .catch((err) => {
      if (err) {
        next(new ErrorAuth('Ведены неправильный email или пароль'));
      } else {
        next(err);
      }
    });
};
