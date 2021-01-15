const Article = require('../models/article');
const { ErrorRequest, ErrorForbidden, ErrorNotFound } = require('../errors/errors');

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
    throw new ErrorRequest('Введены неверные данные');
  }
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorRequest('Введены неверные данные'));
      }

      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        throw new ErrorNotFound('Новость не найдена');
      } if ((article.owner._id.toString() || article.owner.id.toString()) !== req.user._id) {
        throw new ErrorForbidden('Недостаточно прав');
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
        next(new ErrorNotFound('Новость не найдена'));
      } else {
        next(err);
      }
    });
};
