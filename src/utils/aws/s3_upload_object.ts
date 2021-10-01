// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client'; // Helper function that creates Amazon S3 service client module.
// import path from 'path';
// import fs from 'fs';
/*
const file = './default.jpg'; // Path to and name of object. For example '../myFiles/index.js'.
const fileStream = fs.createReadStream(file);

// Set the parameters
const uploadParams = {
  Bucket: 'BUCKET_NAME',
  // Add the required 'Key' parameter using the 'path' module.
  Key: path.basename(file),
  // Add the required 'Body' parameter
  Body: fileStream
};
*/
const uploadParams = {
  Bucket: 'tntheall',
  // Add the required 'Key' parameter using the 'path' module.
  Key: './default.jpg',
  // Add the required 'Body' parameter
  Body: "no",
};
// Upload file to specified bucket.
const upload_object = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Success', data);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
export { upload_object };
