import { PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';

type Config = {
  AllowedHeaders: string[];
  AllowedMethods: string[];
  AllowedOrigins: string[];
  ExposeHeaders: never[];
  MaxAgeSeconds: number;
};
const config: Config = {
  AllowedHeaders: ['Authorization'],
  AllowedMethods: [],
  AllowedOrigins: ['*'],
  ExposeHeaders: [],
  MaxAgeSeconds: 3000
};

const allowedArray = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
const allowedMethods: string[] = [];

process.argv.forEach(function (val, index, array) {
  let upperVal = val.toUpperCase();
  if (allowedArray.includes(upperVal)) {
    allowedMethods.push(upperVal);
  }
});
config.AllowedMethods = allowedMethods;

const corsRules = new Array(config);

export const corsParams = {
  Bucket: 'tntheall',
  CORSConfiguration: { CORSRules: corsRules }
};

const setcors = async () => {
  try {
    const data = await s3Client.send(new PutBucketCorsCommand(corsParams));
    console.log('Success', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
export { setcors };
