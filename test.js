import dotenv from "dotenv";
dotenv.config();

import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const AWSID = process.env.aws_access_key_id
const AWSXX = process.env.aws_secret_access_key

const client = new S3Client({
    credentials: {
        accessKeyId: AWSID,
        secretAccessKey: AWSXX,
    },
});
export const helloS3 = async () => {
    const command = new ListBucketsCommand({});
    const { Buckets } = await client.send(command);

    console.log("Buckets:");
    console.log(Buckets.map((bucket) => bucket.Name).join("\n"));

    return Buckets;
};

helloS3()