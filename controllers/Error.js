exports.PageNotFound = (req, res, next) => {
    res.status(404).render("Error/404", {
        PageTitle: "Page Not Found!",
        path: "",
        isAuth : req.session.LoggedIn,
    });
};
