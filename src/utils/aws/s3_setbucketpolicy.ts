// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-bucket-policies.html
import { PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';

const BUCKET_NAME = 'tntheall';
export const bucketParams = {
  Bucket: BUCKET_NAME
};
// Create the policy
const readOnlyAnonUserPolicy = {
  Statement: [
    {
      Sid: 'AddPerm',
      Effect: 'Allow',
      Principal: '*',
      Action: ['s3:GetObject'],
      Resource: ['']
    }
  ]
};

const bucketResource = 'arn:aws:s3:::' + BUCKET_NAME + '/*'; 
readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

const bucketPolicyParams = {
  Bucket: BUCKET_NAME,
  Policy: JSON.stringify(readOnlyAnonUserPolicy)
};

const setbucketpolicy = async () => {
  try {
    const response = await s3Client.send(
      new PutBucketPolicyCommand(bucketPolicyParams)
    );
    console.log('Success, permissions added to bucket', response);
    return response;
  } catch (err) {
    console.log('Error', err);
  }
};
export { setbucketpolicy };
