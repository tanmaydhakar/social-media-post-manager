const axios = require('axios');

//creates post on fb page
const postFacebook = function (req) {
    const data = req.body;
    if (!data.action) {
        return {
            error: "Action not available"
        };
    }

    let method;
    let postData = {};
    let params = {};
    let url;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (data.action == "create") {
        if (data.message) {
            postData.message = data.message;
        }
        if (data.imageUrl) {
            postData.attached_media = data.imageUrl;
        }
        if (!(data.message && data.imageUrl) || !(data.scheduleTime)) {
            return {
                error: "Invalid Data"
            };
        }
        params.published = "false";
        params.access_token = accessToken;
        params.scheduled_publish_time = new Date(data.scheduleTime);
        method = 'post';
        url - `https://graph.facebook.com/${process.env.FACEBOOK_PAGEID}/feed`;
    } else if (data.action == "edit") {

    } else if (data.action == "delete") {

    } else {
        return {
            error: "Invalid Action"
        }
    }

    axios({
            method: method,
            url: url,
            params: postData,
            data: postData
        }).then((response) => {
            const data = response.data;
            console.log(data);
        })
        .catch((error) => {
            console.log(error.message, new Date());
            return {
                error: error
            }
        });
}

module.exports = {
    postFacebook
}