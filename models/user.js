const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not valid email`,
    },
  },
  password: {
    type: String,
    select: false,
    validate: {
      validator(v) {
        return /[a-z0-9]*/i.test(v);
      },
      message: 'Not valid password',
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

UserSchema.statics.findUserByEmail = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', UserSchema);
