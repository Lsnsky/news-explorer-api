const jwt = require('jsonwebtoken');
const { KEY } = require('../config/index');
const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (authorization || authorization.startsWith('Bearer')) {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, KEY);
    } catch (err) {
      return next(new AuthError('Неправильный email или пароль'));
    }
    req.user = payload;
  }
  return next();
};
