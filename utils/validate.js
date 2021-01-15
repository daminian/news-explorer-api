const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const usersEmail = (v) => validator.isEmail(v);

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
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().pattern(new RegExp('^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$')),
    // eslint-disable-next-line no-useless-escape
    image: Joi.string().required().pattern(new RegExp('^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$')),
  }),
});

module.exports = {
  usersEmail,
  validateRegistration,
  validateLogin,
  validateId,
  validateArticlesPost,
};
