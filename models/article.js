const mongoose = require('mongoose');

const ArticleShema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$/i;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not valid URL`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$/i;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not valid URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', ArticleShema);
