const router = require('express').Router();
const { getUserInfo } = require('../controllers/users');
const cookieCleaner = require('../middlewares/cookie-cleaner');

router.get('/me', getUserInfo);
router.delete('/logout', cookieCleaner);

module.exports = router;
