// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudfront/command/CreateInvalidationCommand/

// Project primatives
import { logIt } from "./lib_LogUtil.js";
import * as _xo from "./lib_Utilities.js";

// AWS SDK
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const s3Client = new CloudFrontClient({
    region: "us-west-2"
});

// Module Constants
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { invalidateDistributionPath };

async function invalidateDistributionPath(distributionId, newPhotoAlbums) {

    try {
        // send file to AWS
        logIt(LOG, `Invalidating Cache for: ${distributionId}`);
        let newAlbumPaths = await _xo.getAlbumPaths(newPhotoAlbums);
        let paths = _xo.objectValuesToArray(newAlbumPaths)
        logIt(BOX, paths)

        const params = {
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: Date.now().toString(),
                Paths: {
                    Quantity: paths.length,
                    Items: paths,
                },
            },
        };

        const command = new CreateInvalidationCommand(params);
        await s3Client.send(command);
        logIt(FIG, `Invalidation started for: ${distributionId}`);
        logIt(BOX, `Paths: ${paths}`)

    } catch (err) {
        logIt(BOX, "ERROR");
        logIt(ERR, "run_AWSCFD:invalidateCache", err);
    }
}
