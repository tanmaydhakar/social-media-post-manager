const path = require('path'),
    userPolicy = require(path.resolve('./modules/users/users.policy')),
    postController = require(path.resolve('./modules/posts/posts.controller'));

module.exports = function (app) {
    
    //for creating post
    app.post('/post', userPolicy.isLoggedIn, postController.create);

    //for listing all posts by logged in user
    app.get('/post', userPolicy.isLoggedIn, postController.listAll);

    //for updating post
    app.patch('/post/:postId', userPolicy.isLoggedIn, postController.update);

    //for deleting post
    app.delete('/post/:postId', userPolicy.isLoggedIn, postController.deletePost);

    


};