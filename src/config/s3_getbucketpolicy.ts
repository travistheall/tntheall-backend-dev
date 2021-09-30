// Import required AWS SDK clients and commands for Node.js
import { GetBucketPolicyCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client'; // Helper function that creates Amazon S3 service client module.

// Create the parameters for calling
const bucketParams = { Bucket: 'tntheall' };

const getbucketpolicy = async () => {
  try {
    const data = await s3Client.send(new GetBucketPolicyCommand(bucketParams));
    console.log('Success', data);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
export { getbucketpolicy };
