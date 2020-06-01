require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { PORT, mongooseConfig, mongooseUrl } = require('./config/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();
mongoose.connect(mongooseUrl, mongooseConfig);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
// подключение логгера запросов
app.use(requestLogger);

// краш-тест
// app.get('/crash-test', () => {
//     setTimeout(() => {
//         throw new BadGatewayError('Сервер сейчас упадёт');
//     }, 0);
// });

// роуты регистрации и логина
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// авторизация
app.use(auth);

// роуты доступа к информации
app.use('/users', usersRouter);
// app.use('/articles', articlesRouter);

// подключение логгера ошибок
app.use(errorLogger);

// обработчики ошибок

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? err.message : message,
//     });
// });


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
