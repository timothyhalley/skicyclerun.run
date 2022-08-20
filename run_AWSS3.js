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

// Node JS 
import { readFile } from 'node:fs/promises'

// Project primatives
import { logit } from './run_logutil.js';
import * as _xo from './run_utilites.js';

// AWS SDK
import {
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    GetObjectCommand,
    GetObjectAttributesCommand,
    ListObjectsCommand
} from "@aws-sdk/client-s3"

// Module Constants
const ERR = 'err';
const BOX = 'box';
const LOG = 'log';
const FIG = 'fig';
const BUG = 'debug';
const SLL = 'sllog';

export { listBucket, createBucket, putObject, upLoadAlbums }

// Module CONST

async function upLoadAlbums(S3BUCKET, PHOTOWEB) {

    try {
        let totalBytes = 0
        // get file list array
        let webPhotos = await _xo.getDirFiles(PHOTOWEB, 'JPEG', 'JPG')

        // send file to AWS 
        logit(SLL, 'start', `Sending to AWS: ${S3BUCKET} - Start`)
        for (let photo of webPhotos) {

            logit(SLL, 'info', photo.split('/').pop())
            // AWS command to send to S3
            let awsMetaData = await putObject(S3BUCKET, photo)
            if (awsMetaData) {
                totalBytes = totalBytes + awsMetaData.ObjectSize
            }
        }
        logit(SLL, 'stop', 'Sending to AWS: ${S3BUCKET} - Fini')
        return [webPhotos.length, _xo.niceBytes(totalBytes)]

    } catch (err) {
        logit(FIG, 'ERROR')
        logit(ERR, 'run_AWSS3:upLoadAlbums', err)
        return [0, 0]
    }

}

async function listBucket(S3BUCKET) {

    try {
        let totalBytes = 0
        let cmdParams = {
            Bucket: S3BUCKET
        }
        let getBucketList = new ListObjectsCommand(cmdParams)
        let bucket_data = await sndCommand(getBucketList)
        let bucketContents = bucket_data.Contents
        logit(SLL, 'start', `Processing: ${S3BUCKET} - Start`)
        for (let item of bucketContents) {
            logit(SLL, 'info', item.Key)
            totalBytes = totalBytes + item.Size
        }
        logit(SLL, 'stop', 'Processing: ${S3BUCKET} - Fini')
        return _xo.niceBytes(totalBytes)
    } catch (err) {
        logit(FIG, 'ERROR')
        logit(ERR, 'run_AWSS3:listBucket', err)
        return null;
    }

}

async function putObject(S3BUCKET, inFile) {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#body

    // get file and album from path - 2 deep only
    const delim = '/'
    const fileArr = inFile.split(delim)
    const fileName = fileArr.pop();
    const fileAlbum = fileArr.pop();
    let objS3Path = 'albums' + delim + fileAlbum + delim + fileName;
    objS3Path = objS3Path.toLocaleLowerCase()

    try {
        const s3File = await readFile(inFile);
        let cmdParams = {
            Bucket: S3BUCKET,
            Body: s3File,
            Key: objS3Path
        }
        let putObjCmd = new PutObjectCommand(cmdParams)
        let putResults = await sndCommand(putObjCmd)
        if (putResults.$metadata.httpStatusCode == 200) {
            cmdParams = {
                Bucket: S3BUCKET,
                Key: objS3Path,
                ObjectAttributes: [
                    // 'ETag' | 'Checksum' | 'ObjectParts' | 'StorageClass' | 'ObjectSize'
                    'ObjectSize'
                ]
            }
            let getObjCmd = new GetObjectAttributesCommand(cmdParams)
            let getResults = await sndCommand(getObjCmd)
            return getResults
        }
        return

    } catch (err) {
        logit(FIG, 'ERROR')
        logit(ERR, 'run_AWSS3:putObject', err)
        return null
    }
}

async function createBucket(bucket) {

    try {
        let cmdParams = {
            Bucket: bucket
        }
        let createBucketCmd = new CreateBucketCommand(cmdParams)
        return await sndCommand(createBucketCmd)

    } catch (err) {
        logit(FIG, 'ERROR')
        logit(ERR, 'run_AWSS3:createBucket', err)
        return null
    }
}

async function sndCommand(command) {

    const s3 = new S3Client({
        region: 'us-west-2',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    try {
        return await s3.send(command);
    } catch (err) {
        logit(FIG, 'ERROR')
        logit(ERR, 'run_AWSS3:sndCommand', err)
        return err
    }
}

// --------------------------------------------------------------------------