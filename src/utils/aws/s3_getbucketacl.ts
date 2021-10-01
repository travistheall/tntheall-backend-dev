import { GetBucketAclCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

const bucketParams = { Bucket: "tntheall" };

const getbucketacl = async () => {
  try {
    const data = await s3Client.send(new GetBucketAclCommand(bucketParams));
    console.log("Success", data.Grants);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

export { getbucketacl };