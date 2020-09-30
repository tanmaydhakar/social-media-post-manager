const path = require('path');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const constants = require(path.resolve('./modules/core/constants.controller')).constants;
const fbAuth = require(path.resolve('./modules/core/facebookAuth.controller.js'));

//creates post
const create = function (req, res) {
  if (!req.body || !req.user || (!req.body.message && req.file && !req.file.location) || !req.body.scheduleTime) {
    return res.status(400).send('Bad request');
  }

const date = new Date();

if(new Date(req.body.scheduleTime).getTime - new Date().getTime() < 20*60*1000 || new Date(req.body.scheduleTime).getTime() - new Date().getTime() > 75*4*60*1000){
  return res.status(422).send('Post can be scheduled for minimum 20 mins ahead and maximum of 75 days ahead');
}

  req.body.action = "create";

  fbAuth.postFacebook(req).then((postResult) => {
    if (!postResult || !postResult.id) {
      return res.status(500).send("Some error occured");
    } else {
      const post = {
        user: req.user._id,
        message: req.body.message ? req.body.message : null,
        imageUrl: (req.file && req.file.location) ? req.file.location : null,
        scheduleDate: new Date(req.body.scheduleTime),
        pagePostId: postResult.id
      };

      Post.create(post, function (err, result) {
        if (err) {
          console.log(err, new Date());
          return res.status(500).send('Error occured');
        } else {
          return res.status(200).send('Post scheduled successfully');
        }
      });
    }
  }).catch((error) => {
    console.log(error, new Date());
    return res.status(500).send("Some error occured");
  });
}

//updates post
const update = function (req, res) {
  if (!req.body || !req.user || !req.params.postId || !req.body.message) {
    return res.status(400).send('Bad request');
  }

  const postId = mongoose.Types.ObjectId(req.params.postId);

  Post.findOne({
    '_id': postId,
    'user': req.user._id
  }, function (err, post) {
    if (err) {
      console.log(err, new Date());
      return res.status(500).send('Error occured');
    } else if (!post) {
      return res.status(422).send('Post does not exists');
    } else if (post.status !== constants.POST_STATUS[0]) {
      return res.status(422).send('You cant update this post now');
    } else {
      req.body.action = 'update';
      req.body.pagePostId = post.pagePostId;

      fbAuth.postFacebook(req).then((postResult) => {

        if (!postResult || !postResult.success) {
          return res.status(500).send("Some error occured");
        } else {
          const postData = {
            message: req.body.message
          };
          Post.updateOne({
            '_id': postId
          }, {
            '$set': postData
          }, function (err, result) {
            if (err) {
              console.log(err, new Date());
              return res.status(500).send('Error occured');
            } else {
              return res.status(200).send('Post updated successfully');
            }
          });
        }
      }).catch((error) => {
        console.log(error, new Date());
        return res.status(500).send("Some error occured");
      });
    }
  });
}

//deletes post
const deletePost = function (req, res) {
  if (!req.body || !req.user || !req.params.postId) {
    return res.status(400).send('Bad request');
  }

  const postId = mongoose.Types.ObjectId(req.params.postId);

  Post.findOne({
    '_id': postId
  }, function (err, post) {
    if (err) {
      console.log(err, new Date());
      return res.status(500).send('Error occured');
    } else if (!post) {
      return res.status(422).send('Post does not exists');
    } else if (post.status !== constants.POST_STATUS[0]) {
      return res.status(422).send('You cant delete this post now');
    } else {
      req.body.action = 'delete';
      req.body.pagePostId = post.pagePostId;

      fbAuth.postFacebook(req).then((postResult) => {

        if (!postResult || !postResult.success) {
          return res.status(500).send("Some error occured");
        } else {
          Post.deleteOne({
            '_id': postId
          }, function (err, result) {
            if (err) {
              console.log(err, new Date());
              return res.status(500).send('Error occured');
            } else {
              return res.status(200).send('Post deleted successfully');
            }
          });
        }
      }).catch((error) => {
        console.log(error, new Date());
        return res.status(500).send("Some error occured");
      });
    }
  });
}

//list all posts
const listAll = function (req, res) {
  if (!req.user) {
    return res.status(400).send('Bad request');
  }

  const userId = req.user._id;

  Post.find({
    'user': userId
  }, function (err, posts) {
    if (err) {
      console.log(err, new Date());
      return res.status(500).send('Error occured');
    } else {
      return res.status(200).send(posts);
    }
  });
}

module.exports = {
  create,
  update,
  deletePost,
  listAll
}
