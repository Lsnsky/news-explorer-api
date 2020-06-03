const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { KEY } = require('../config/index');

const BadRequestError = require('../errors/bad-request-err');

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка при отправке запроса');
      }
      res.send(user.omitPrivate({ data: user }));
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, KEY, { expiresIn: '7d' });
      return (res.send({ token })
                || res.cookie('jwt', token, { maxAge: 3600 * 24 * 7, httpOnly: true }));
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};
