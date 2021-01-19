const Article = require('../models/article');
const { ErrorRequest, ErrorForbidden, ErrorNotFound } = require('../errors/errors');
const { INVALID_REQUEST, ARTICLE_NOT_FOUND, NOT_YOUR_ARTICLE } = require('../configs/constants');

module.exports.findArticle = (req, res, next) => {
  Article.find()
    .populate('owner')
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.creatArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  if (!keyword || !title || !text || !date || !source || !link || !image) {
    throw new ErrorRequest(INVALID_REQUEST);
  }
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorRequest(INVALID_REQUEST));
      }

      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        throw new ErrorNotFound(ARTICLE_NOT_FOUND);
      } if ((article.owner._id.toString() || article.owner.id.toString()) !== req.user._id) {
        throw new ErrorForbidden(NOT_YOUR_ARTICLE);
      }
      return Article.findByIdAndRemove(req.params.id)
        .then((responce) => {
          if (responce.deleteCount !== 0) {
            res.send({
              data: article,
            });
          }
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorNotFound(ARTICLE_NOT_FOUND));
      } else {
        next(err);
      }
    });
};
