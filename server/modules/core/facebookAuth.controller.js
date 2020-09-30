const axios = require('axios');

//creates post on fb page
const postFacebook = function (req) {
    return new Promise((resolve, reject) => {
        if (!req.body.action) {
            return reject("Action not available");
        };

        let method;
        let postData = {};
        let url;
        postData.access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

        if (req.body.action == "create") {
            if ((!req.body.message && !req.file.location) || !(req.body.scheduleTime)) {
                return reject("Invalid Data");
            };
            if (req.body.message) {
                postData.message = req.body.message;
                url = `https://graph.facebook.com/${process.env.FACEBOOK_PAGEID}/feed`;
            };
            if (req.file && req.file.location) {
                postData.url = req.file.location;
                url = `https://graph.facebook.com/${process.env.FACEBOOK_PAGEID}/photos`;
            };
            postData.published = "false";
            postData.scheduled_publish_time = Math.round((new Date(req.body.scheduleTime).getTime()) / 1000);
            method = 'post';
        } else if (req.body.action == "update") {
            if (!req.body.message || !req.body.pagePostId) {
                return reject("Invalid Data");
            };
            method = 'post';
            postData.message = req.body.message;
            url = `https://graph.facebook.com/${req.body.pagePostId}`;
        } else if (req.body.action == "delete") {
            if (!req.body.pagePostId) {
                return reject("Invalid Data");
            };
            method = 'delete';
            postData.message = req.body.message;
            url = `https://graph.facebook.com/${req.body.pagePostId}`;
        } else {
            return reject("Invalid Action");
        }
    
        axios({
                method: method,
                url: url,
                data: postData
            }).then((response) => {
                const data = response.data;
                return resolve(data);
            })
            .catch((error) => {
                console.log(error.message, new Date());
                return reject(error);
            });

    })
}

module.exports = {
    postFacebook
}