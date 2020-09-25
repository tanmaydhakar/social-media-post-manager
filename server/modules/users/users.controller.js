const path = require("path"),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

//logs out user
const logout = function (req, res) {
    req.logout();
    return res.status(200).send("Success");
}

//for new user registration
const register = function (req, res) {
    if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send('Bad Request');
    }

    var userData = {
        username: req.body.username,
        email: req.body.email,
    }

    User.register(new User(userData), req.body.password, function (err, user) {
        if (err) {
            console.log(err, new Date());
            return res.status(500).send(err.message);
        }
        return res.status(200).send("Success");
    });
}

//for user login
const login = function (req, res) {
    return res.status(200).send("Success");
}

module.exports = {
    logout,
    register,
    login
}