module.exports = (req, res, next) => {
    if (!req.session.LoggedIn) {
        return res.redirect('/login');
    } else {
        next()
    }
}