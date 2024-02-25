const AWS = require('aws-sdk');

const uploadToS3 = (data, file) => {

    console.log(process.env.IAM_USER_KEY, process.env.IAM_USER_SECERT, process.env.BUCKET_NAME);

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECERT
        // Bucket: BUCKET_NAME
    });

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: file,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3res) => {
            if (err) {
                console.log('Something went wrong!', err);
                reject(err);
            } else {
                // console.log('Success', s3res);
                resolve(s3res.Location);
            }
        });
    });
}

module.exports = {
    uploadToS3
};