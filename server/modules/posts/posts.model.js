var path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Constants = require(path.resolve('./modules/core/constants.controller')).constants;

var Post = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: Constants.POST_STATUS,
        default: ['Scheduled']
    },
    scheduleDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

mongoose.model('Post', Post);