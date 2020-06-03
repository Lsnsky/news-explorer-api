require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { PORT, mongooseConfig, MONGOOSE_URL } = require('./config/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routerMain = require('./routes/index');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errors-handler');
const { createUser, login } = require('./controllers/users');

const app = express();
mongoose.connect(MONGOOSE_URL, mongooseConfig);

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

// авторизация, дальнейшие роуты защищены
app.use(auth);

// роуты доступа к информации
app.use('/', routerMain);

// подключение логгера ошибок
app.use(errorLogger);

// обработчики ошибок

// ошибка при неправильном адресе в строке
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// обработчик ошибок celebrate
app.use(errors());


// централизованный обработчик ошибок
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
