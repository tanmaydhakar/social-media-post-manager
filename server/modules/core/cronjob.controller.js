const cron = require('node-cron');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const constants = require(path.resolve('./modules/core/constants.controller')).constants;

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');

  /*
    Post.find({'status':constants.POST_STATUS[0], 'scheduleDate':{'$lte':new Date()}}, function(err, posts){

    });

  */
});