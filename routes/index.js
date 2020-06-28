const routerMain = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const cookieCleaner = require('../middlewares/cookie-cleaner');

routerMain.use('/users', usersRouter);
routerMain.use('/articles', articlesRouter);
routerMain.delete('/logout', cookieCleaner);

module.exports = routerMain;