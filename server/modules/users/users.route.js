const path = require('path'),
    passport = require('passport'),
    userController = require(path.resolve('./modules/users/users.controller'));

module.exports = function (app) {

    //for user login
    app.post('/login', passport.authenticate('local'), userController.login);

    //for user registration
    app.post('/register', userController.register);

    //for user logout
    app.get('/logout', userController.logout);
};