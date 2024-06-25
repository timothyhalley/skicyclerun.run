// AWS API Doc
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/

// Node JS
import { readFile } from "node:fs/promises";

// Project primatives
import { logIt } from "./lib_LogUtil.js";
import * as _xo from "./lib_Utilities.js";

// AWS SDK
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  GetObjectAttributesCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-west-2"
});

// Module Constants
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { listBucketItems, createBucket, removeAlbums, putObject, upLoadAlbums };

// Module CONST

async function upLoadAlbums(S3BUCKET, PHOTOWEB) {

  try {
    let totalBytes = 0;
    // get file list array
    let webPhotos = await _xo.getDirFiles(
      PHOTOWEB,
      "JPEG",
      "JPG",
      "GIF",
      "SVG"
    );

    // send file to AWS
    logIt(SLL, "start", `Sending to AWS: ${S3BUCKET} - Start`);
    for (let photo of webPhotos) {
      logIt(SLL, "info", photo.split("/").pop());
      // AWS command to send to S3
      let awsMetaData = await putObject(S3BUCKET, photo);
      if (awsMetaData) {
        totalBytes = totalBytes + (await _xo.getFileInfo(photo)).fsz;
      }
    }
    logIt(SLL, "stop", "Sending to AWS: ${S3BUCKET} - Fini");
    return [webPhotos.length, _xo.niceBytes(totalBytes)];
  } catch (err) {
    logIt(BOX, "ERROR");
    logIt(ERR, "run_AWSS3:upLoadAlbums", err);
    return [0, 0];
  }
}

async function listBucketItems(bucketName, maxKeys = 10) {
  try {
    let totalBytes = 0;

    let cmdParams = {
      Bucket: bucketName,
      MaxKeys: maxKeys
    };
    const command = new ListObjectsV2Command(cmdParams);
    console.log("TEST")
    let bucket_data = await s3Client.send(command);
    let bucketContents = bucket_data.Contents;
    logIt(SLL, "start", `Processing: ${bucketName} - Start`);
    for (let item of bucketContents) {
      logIt(SLL, "info", item.Key);
      totalBytes = totalBytes + item.Size;
    }
    logIt(SLL, "stop", `Processing: ${bucketName} - Fini`);
    return _xo.niceBytes(totalBytes);
  } catch (err) {
    logIt(BOX, "NOTE: list Bucket - no items found");
    logIt(ERR, "run_AWSS3:listBucket", err);
    logIt(BOX, "Key: ", process.env.aws_access_key_id)
    return 0;
  }
}

async function removeAlbums(bucketName, webRepo) {

  const albums = await _xo.getAlbumPaths(webRepo)

  for (let album of albums) {
    // const folderName = _xo.appendSlashToPath(_xo.convertToLowerCase(album));
    const folderName = _xo.removeLeadingSlash(_xo.convertToLowerCase(album))
    await deleteFolderContents(bucketName, folderName)
  }
}

async function deleteFolderContents(bucketName, folderName) {

  const listParams = {
    Bucket: bucketName,
    Prefix: folderName // The folder path (e.g., "my-folder/")
  };

  try {
    const { Contents, IsTruncated, KeyCount } = await s3Client.send(new ListObjectsV2Command(listParams));

    if (Contents !== undefined && Contents.length > 0) {
      // Extract keys (object names) from the result
      const keysToDelete = Contents.map((obj) => ({ Key: obj.Key }));

      // Delete all objects in one batch
      const deleteParams = {
        Bucket: bucketName,
        Delete: { Objects: keysToDelete },
      };
      await s3Client.send(new DeleteObjectsCommand(deleteParams));

      logIt(BOX, `Deleted ${keysToDelete.length} objects from ${folderName}`);
      isEmpty = false; // Folder is not empty

    } else {
      logIt(BOX, `Folder ${folderName} is already empty.`);
    }

  } catch (error) {
    logIt(ERR, "Error deleting objects:", error);
  }

}

async function putObject(S3BUCKET, inFile) {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#body

  // get file and album from path - 2 deep only
  const delim = "/";
  const fileArr = inFile.split(delim);
  const fileName = fileArr.pop();
  const fileAlbum = fileArr.pop();
  let objS3Path = "albums" + delim + fileAlbum + delim + fileName;
  objS3Path = objS3Path.toLocaleLowerCase();

  try {
    const s3File = await readFile(inFile);
    const command = new PutObjectCommand({
      Bucket: S3BUCKET,
      Body: s3File,
      Key: objS3Path
    });
    await s3Client.send(command);
    return true
  } catch (error) {
    logIt(BOX, "ERROR");
    logIt(ERR, "lib_AWSS3:putObject:", error)
    return false
  }

}

async function createBucket(bucket) {
  try {
    let cmdParams = {
      Bucket: bucket,
    };
    let command = new CreateBucketCommand(cmdParams);
    const response = await s3Client.send(command);
    return response.ContentLength
  } catch (err) {
    logIt(BOX, "ERROR");
    logIt(ERR, "run_AWSS3:createBucket", err);
    return null;
  }
}


// --------------------------------------------------------------------------
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectCommand/
// https://www.npmjs.com/package/@aws-sdk/client-s3
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html
// AWS SDK for JavaScript V3 API Reference Guide
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
// JavaScript Developer Blog
// https://aws.amazon.com/blogs/developer/category/programing-language/javascript/
// AWS JavaScript Forum
// https://forums.aws.amazon.com/forum.jspa?forumID=148
// JavaScript examples in the AWS Code Catalog
// https://docs.aws.amazon.com/code-samples/latest/catalog/code-catalog-javascriptv3.html
// AWS Code Example Repository
// https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascriptv3/example_code
// Gitter channel
// https://gitter.im/aws/aws-sdk-js

// API --> https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
// PutObjectRequest input: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#body
