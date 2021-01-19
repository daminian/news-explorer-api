const express = require('express');

const app = express();
const auth = require('../middlewares/auth');

const signin = require('./signin');
const signup = require('./signup');
const users = require('./users');
const articles = require('./articles');
const errorApp = require('./errorall');

app.use('/signin', signin);
app.use('/signup', signup);
app.use('/', auth, users);
app.use('/', auth, articles);
app.use('/*', errorApp);

module.exports = app;
