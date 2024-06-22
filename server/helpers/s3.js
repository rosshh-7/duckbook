require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const path = require("path");
const im = require("imagemagick");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

async function uploadUserFile(file) {
  console.log(file.path);
  console.log("andar aya");

  const imageSourcePath = path.join(__dirname, "..", "/", file.path);
  console.log(file.path);
  console.log(imageSourcePath);
  const imageDestinationPath = path.join(
    __dirname,
    "..",
    "../client/public/uploads",
    file.filename
  );
  console.log("second");
  console.log(imageDestinationPath);

  setTimeout(() => {
    im.resize({
      srcPath: imageSourcePath,
      dstPath: imageDestinationPath,
      width: 250,
      height: 250,
    });

    console.log("im k andar");
  }, 4000);

  // return im
  //   .resize(
  //     {
  //       srcPath: imageSourcePath,
  //       dstPath: imageDestinationPath,
  //     },
  //     100,
  //     100
  //   )
  //   .stream(function (err) {
  //     if (err) {
  //       console.log("error");
  //     }
  //     //else {
  //     //   const params = {
  //     //     Bucket: bucketName,
  //     //     Key: file.filename,
  //     //     Body: fs.createReadStream(imageDestinationPath),
  //     //     ContentType: file.mimetype,
  //     //   };
  //     //   s3.upload(params).promise();
  //     // }
  //   });
  return;
}
exports.uploadUserFile = uploadUserFile;

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// Deletes a file from s3
function DeleteFile(filename) {
  s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  return "File Deleted Successfully";
}
exports.DeleteFile = DeleteFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
