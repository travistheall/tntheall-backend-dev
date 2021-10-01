// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-configuring-buckets.html
import { S3Client } from '@aws-sdk/client-s3';

// Set the AWS Region.
const REGION = 'us-east-1';
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION});

export { s3Client };