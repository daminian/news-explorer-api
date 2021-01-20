const router = require('express').Router();
const { findArticle, creatArticle, deleteArticle } = require('../controllers/articles');
const { validateArticlesPost, validateId } = require('../utils/validate');

router.get('/articles', findArticle);
router.post('/articles', validateArticlesPost, creatArticle);
router.delete('/articles/:id', validateId, deleteArticle);

module.exports = router;
