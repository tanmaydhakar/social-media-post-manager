const path = require('path');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const constants = require(path.resolve('./modules/core/constants.controller')).constants;

//creates post
const create = function (req, res) {
  if (!req.body || !req.user || !req.body.content || !req.body.scheduleTime) {
    return res.status(400).send('Bad request');
  }

  const post = {
    user: req.user._id,
    content: req.body.content,
    image: req.body.image,
    scheduleDate: new Date(req.body.scheduleDate)
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

//updates post
const update = function (req, res) {
  if (!req.body || !req.user || !req.params.postId || !req.body.content || !req.body.scheduleTime) {
    return res.status(400).send('Bad request');
  }

  const postId = mongoose.Types.ObjectId(req.params.postId);
  const postData = {
    content: req.body.content,
    image: req.body.image,
    scheduleDate: new Date(req.body.scheduleDate)
  };

  Post.findOne({
    '_id': postId
  }, function (err, post) {
    if (err) {
      console.log(err, new Date());
      return res.status(500).send('Error occured');
    } else if (post.status !== constants.POST_STATUS[0]) {
      return res.status(422).send('You cant update this post now');
    } else {
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
    } else if (post.status !== constants.POST_STATUS[0]) {
      return res.status(422).send('You cant delete this post now');
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
