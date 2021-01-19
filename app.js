require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { errors } = require('celebrate');
const urls = require('./routes/index');
const limiter = require('./utils/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorServer = require('./middlewares/error');
const { MONGOURL } = require('./configs/config');

const { PORT = 3000, MONGODB = MONGOURL } = process.env;
const app = express();

mongoose.connect(MONGODB, {
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

app.use('/', urls);

app.use(errorLogger);
app.use(errors());

app.use(errorServer);

app.listen(PORT);
