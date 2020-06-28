module.exports = (req, res) => {
    res.clearCookie('jwt').send({ message: 'Logout success' });
    // res.cookie('jwt', "", {
    //     'max-age': -1
    // });
};