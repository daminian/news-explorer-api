const router = require('express').Router();
const { validateRegistration } = require('../utils/validate');
const { createUser } = require('../controllers/users');

router.post('/', validateRegistration, createUser);

module.exports = router;
