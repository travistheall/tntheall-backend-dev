// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-configuring-buckets.html

import { GetBucketCorsCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client'; 

const bucketParams = { Bucket: 'tntheall' };

const getcors = async () => {
  try {
    const data = await s3Client.send(new GetBucketCorsCommand(bucketParams));
    console.log('Success', JSON.stringify(data.CORSRules));
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
export {getcors};