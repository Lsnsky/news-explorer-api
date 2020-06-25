module.exports = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Logout success' });
  // setCookie(name, "", {
  //     'max-age': -1
  // });
};
