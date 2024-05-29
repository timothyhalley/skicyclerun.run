import dotenv from "dotenv";
dotenv.config();

import * as _aws from "./run_AWSS3.js";
import { gmapElevation } from "./run_Google.js";
import { logit } from "./run_LogUtil.js";

const AWSBUCKET = "skicyclerun.lib";

// Module Constants
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

async function test_AWS() {
    logit(BOX, `AWS TEST - LIST ITEMS: ${AWSBUCKET}`);
    const totalBytes = await _aws.listBucketItems(AWSBUCKET);
    logit(BOX, `AWS TEST - FINISHED`);
}

async function test_GCP() {
    const home = {
        lat: 47.711643078463794,
        lon: -122.0349659116248
    }
    logit(BOX, "GCP START");
    const elevation = await gmapElevation(home.lat, home.lon);
    logit(BOX, "GCP FINI - your elevation is: ", elevation);
}

(async function () {
    // Tasks START
    logit(FIG, "TEST START");
    await test_AWS();
    await test_GCP();
    logit(FIG, "TEST FINI");
    // AWS Fini
})();