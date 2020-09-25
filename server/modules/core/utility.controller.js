const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const uploadToS3 = function () {
    aws.config.update({
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY_IDS,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET_NAME,
        endpoint: "http://localhost:3000",
    });

    const s3 = new aws.S3();

    const fileFilter = function (req, file, cb) {
        if(!file.mimetype === "image/jpg"  || 
       !file.mimetype ==="image/jpeg"  || 
       !file.mimetype ===  "image/png"){
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }

    return multer({
        fileFilter,
        storage: multerS3({
            s3: s3,
            bucket: process.env.S3_BUCKET_NAME,
            acl: 'public-read',
            metadata: function (req, file, cb) {
                cb(null, {
                    fieldName: file.fieldname
                });
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString())
            }
        })
    });
}

const singleUploadToS3 = function (req, res) {

    const upload = uploadToS3();
    const singleUpload = upload.single('image');

    singleUpload(req, res, function (err) {
        if (err) {
            console.log(err, new Date());
            return false;
        } else {
            return req.file.location;
        }
    });
}

module.exports = {
    singleUploadToS3
}