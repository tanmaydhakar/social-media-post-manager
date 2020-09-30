const path = require('path'),
    userPolicy = require(path.resolve('./modules/users/users.policy')),
    postController = require(path.resolve('./modules/posts/posts.controller')),
    utility = require(path.resolve('./modules/core/utility.controller.js'));


module.exports = function (app) {

    //for creating post
    app.post('/api/post', userPolicy.isLoggedIn, utility.singleUploadToS3, postController.create);

    //for listing all posts by logged in user
    app.get('/api/post', userPolicy.isLoggedIn, postController.listAll);

    //for updating post
    app.patch('/api/post/:postId', userPolicy.isLoggedIn, postController.update);

    //for deleting post
    app.delete('/api/post/:postId', userPolicy.isLoggedIn, postController.deletePost);


};