const path = require("path");

//to check if user is logged in
const isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send("Please Login To Access This Feature");
}

module.exports = {
    isLoggedIn
}