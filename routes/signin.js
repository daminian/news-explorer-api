const router = require('express').Router();
const { validateLogin } = require('../utils/validate');
const { login } = require('../controllers/users');

router.post('/', validateLogin, login);

module.exports = router;
