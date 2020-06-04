const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');


module.exports.getArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .orFail(() => new NotFoundError('Сохраненных статей не найдено'))
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send(article.ownerPrivate({ data: article })))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    .orFail(() => new NotFoundError(`статья с id:${req.params.id} не найдена в базе данных`))
    .then((article) => {
      const { owner } = article;
      return owner;
    })
    .then((owner) => {
      if (req.user._id !== owner.toString()) {
        return Promise.reject(new ForbiddenError(`у вас нет доступа для удаления статьи с id:${req.params.id}`));
      }
      return Article.findByIdAndRemove(req.params.id);
    })
    .then(() => res.send({ message: `статья с id:${req.params.id} успешно удалена из базы данных` }))
    .catch(next);
};

// "keyword":"test",
// "title":"test",
// "text":"test",
// "date":"test",
// "source":"test",
// "link":"https://test.com",
// "image":"https://test.com"
