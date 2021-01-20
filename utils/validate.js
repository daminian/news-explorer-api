const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const { INVALID_URL } = require('../configs/constants');

const usersEmail = (v) => validator.isEmail(v);

function urlValidation(value) {
  if (!validator.isURL(value)) {
    throw new CelebrateError(INVALID_URL);
  }
  return value;
}

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
    name: Joi.string().required().min(2),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateArticlesPost = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(urlValidation).required(),
    image: Joi.string().custom(urlValidation).required(),
  }),
});

module.exports = {
  usersEmail,
  validateRegistration,
  validateLogin,
  validateId,
  validateArticlesPost,
};
