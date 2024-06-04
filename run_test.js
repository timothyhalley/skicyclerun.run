import dotenv from "dotenv";
dotenv.config();

import * as _aws from "./lib_AWSS3.js";
import { gmapElevation } from "./run_Google.js";
import { logIt } from "./run_LogUtil.js";

const AWSBUCKET = "skicyclerun.lib";

// Module Constants
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

async function test_AWS() {
    logIt(BOX, `AWS TEST - LIST ITEMS: ${AWSBUCKET}`);
    const totalBytes = await _aws.listBucketItems(AWSBUCKET);
    logIt(BOX, `AWS TEST - FINISHED`);
}

async function test_GCP() {
    const home = {
        lat: 47.711643078463794,
        lon: -122.0349659116248
    }
    logIt(BOX, "GCP START");
    const elevation = await gmapElevation(home.lat, home.lon);
    logIt(BOX, "GCP FINI - your elevation is: ", elevation);
}

(async function () {
    // Tasks START
    logIt(FIG, "TEST START");
    await test_AWS();
    await test_GCP();
    logIt(FIG, "TEST FINI");
    // AWS Fini
})();