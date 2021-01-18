require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3000;
const app = express();
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const UserRouter = require('./routes/users');
const ArticleRouter = require('./routes/articles');
const limiter = require('./utils/rateLimit');
const { validateRegistration, validateLogin } = require('./utils/validate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorServer = require('./middlewares/error');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

const hosts = [
  'https://localhost:3000',
  'http://localhost:3000',
  'https://www.api.news-daminian.students.nomoreparties.space',
  'http://www.api.news-daminian.students.nomoreparties.space',
  'https://api.news-daminian.students.nomoreparties.space',
  'http://api.news-daminian.students.nomoreparties.space',
  'https://www.news-daminian.students.nomoreparties.space',
  'http://www.news-daminian.students.nomoreparties.space',
  'https://news-daminian.students.nomoreparties.space',
  'http://news-daminian.students.nomoreparties.space',
];
app.use(cors({ origin: hosts }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

app.use(requestLogger);

app.post('/signup', validateRegistration, createUser);
app.post('/signin', validateLogin, login);

app.use('/', auth, UserRouter);
app.use('/', auth, ArticleRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorServer);

app.listen(PORT);
