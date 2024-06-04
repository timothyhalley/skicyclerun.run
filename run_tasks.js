import dotenv from "dotenv";
dotenv.config();

import * as _utl from "./run_Utilities.js";
import * as _lib from "./run_PhotoLib.js";
import * as _db from "./run_LowDB.js";
import { logIt } from "./run_LogUtil.js";
import { runScript } from "./run_Scripts.js";
import { runWeb } from "./run_Web.js";
import { runSVG } from "./run_SVG.js";
import * as _aws from "./run_AWSS3.js";

// Configuration
const PHOTOLIB = "./PhotoLib";
const PHOTOWEB = "./PhotoWeb";
const PHOTOTMP = "./PhotoTmp";
const PHOTOFX = "/3_FXRepo";
const PHOTOCR = "/4_CopyRight";
const PHOTOSVG = "./PhotoLib/SVGPhotos";

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const AWSBUCKET = "skicyclerun.lib";

// STEP #1
async function task_01() {
  logIt(BOX, "TASK #01 - CLEAN DB AND DIRECTORY");
  let dirList = await _lib.resetAll(PHOTOWEB, PHOTOTMP);
  // Output results of PURGE
  logIt(LOG, `Cleanzed DB & Location: ${dirList}`);
}
async function task_02() {
  logIt(BOX, "TASK #02 - Get Photo META data");
  const photos = await _utl.getDirFiles(PHOTOLIB, "JPEG", "JPG", "GIF", "PNG"); //* --> process original photos
  logIt(LOG, `Number of photos to process: ${photos.length}`);
  const numPhotos = await _lib.photoData(photos);
  logIt(LOG, `Photo Data - colleted: ${numPhotos}`);
}
async function task_03() {
  logIt(BOX, "TASK #03 - Copy files to TMP directory");
  const numPhotos = await _lib.photoRename(PHOTOTMP);
  logIt(LOG, `Copy photos - copied: ${numPhotos}`);
}
async function task_04() {
  logIt(BOX, "TASK #04 - Scale Photos");
  const numPhotos = await _lib.photoScale(PHOTOTMP);
  logIt(LOG, `Scale Photos: ${numPhotos}`);
}
async function fxtask_05() {
  logIt(BOX, "TASK #05 - FX GreyScale");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "GreyScale");
  logIt(LOG, `GreyScale Photos: ${numPhotos}`);
}
async function fxtask_06() {
  logIt(BOX, "TASK #06 - FX Sepia");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Sepia");
  logIt(LOG, `Sepia Photos: ${numPhotos}`);
}
async function fxtask_07() {
  logIt(BOX, "TASK #07 - FX Poster");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Poster");
  logIt(LOG, `Poster Photos: ${numPhotos}`);
}
async function fxtask_08() {
  logIt(BOX, "TASK #08 - FX Pencil");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Pencil");
  logIt(LOG, `Pencil Photos: ${numPhotos}`);
}
async function fxtask_09() {
  logIt(BOX, "TASK #09 - FX Watercolor");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Watercolor");
  logIt(LOG, `Watercolor Photos: ${numPhotos}`);
}
async function fxtask_10() {
  logIt(BOX, "TASK #10 - FX Charcoal");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Charcoal");
  logIt(LOG, `Charcoal Photos: ${numPhotos}`);
}
async function fxtask_11() {
  logIt(BOX, "TASK #11 - FX Transparent");
  const numPhotos = await _lib.photoFXMaker(PHOTOTMP, "Transparent");
  logIt(LOG, `Transparent Photos: ${numPhotos}`);
}
async function script_01() {
  logIt(BOX, "SCRIPT #01 - WATERCOLOR");
  const numPhotos = await runScript("watercolor");
  logIt(LOG, `SCRIPT #01 - WATERCOLOR: ${numPhotos}`);
}
async function script_02() {
  logIt(BOX, "SCRIPT #02 - SKETCHING");
  const numPhotos = await runScript("sketching");
  logIt(LOG, `SCRIPT #02 - SKETCHING: ${numPhotos}`);
}
async function script_03() {
  logIt(BOX, "SCRIPT #03 - TINYPLANET");
  const numPhotos = await runScript("tinyplanet");
  logIt(LOG, `SCRIPT #03 - TINYPLANET: ${numPhotos}`);
}
async function script_04() {
  logIt(BOX, "SCRIPT #04 - SHARPEDGE");
  const numPhotos = await runScript("sharpedge");
  logIt(LOG, `SCRIPT #04 - SHARPEDGE: ${numPhotos}`);
}

async function copyRight_00() {

  logIt(BOX, "CopyRight #00 - SkiCycleRun");
  const numPhotos = await _lib.copyRight(PHOTOTMP);
  logIt(LOG, `CopyRight #00 - SkiCycleRun: ${numPhotos}`);

}

async function web_01() {
  logIt(BOX, "WEB #01 - WEB REDUX");
  const [numPhotos, totalBytesSaved] = await runWeb(
    PHOTOTMP,
    PHOTOCR,
    PHOTOWEB
  );
  logIt(
    LOG,
    `WEB #01 - WEB REDUX: ${numPhotos} - Bytes Compressed: ${totalBytesSaved}`
  );
}

async function svg_01() {
  logIt(BOX, "SVG - CONVERT");
  const numSVGPhotos = await runSVG(PHOTOSVG, PHOTOWEB);
  logIt(LOG, `SVG Converted: ${numSVGPhotos}`);
}

async function aws_01() {
  logIt(BOX, `AWS #01 - LIST ITEMS: ${AWSBUCKET}`);
  const totalBytes = await _aws.listBucket(AWSBUCKET);
  logIt(LOG, `AWS #01 - Total Bytes in ${AWSBUCKET} := ${totalBytes}`);
  // await _aws.createBucket('SkiCycleRun-Private')
  // await _aws.putObject('tst01', './images/car.svg')
}

async function aws_02() {
  logIt(BOX, `AWS #02 - UPLOAD: ${AWSBUCKET}`);
  const [numPhotos, totalBytes] = await _aws.upLoadAlbums(AWSBUCKET, PHOTOWEB);
  logIt(LOG, `AWS #02 - Number of files: ${numPhotos} - Bytes: ${totalBytes}`);
}

async function aws_03() {
  logIt(BOX, `AWS #03 - INVALIDATE CACHE: ${AWSBUCKET}`);
  // const invalidationID = await _aws.invalidateCache(AWSBUCKET);
  logIt(LOG, `AWS #02 - Number of files: ${numPhotos} - Bytes: ${totalBytes}`);
}

// ********** Run sequence tasks
(async function () {
  // Tasks START
  logIt(FIG, "PHOTO FX START");

  await task_01();
  await task_02();
  await task_03();
  await task_04();
  await fxtask_05();
  await fxtask_06();
  await fxtask_07();
  await fxtask_08();
  await fxtask_09();
  await fxtask_10();
  await fxtask_11();

  await script_01();
  await script_02();
  await script_03();
  await script_04();

  await copyRight_00();

  await web_01();

  // SVG START
  logIt(FIG, "SVG START");
  await svg_01();
  logIt(FIG, "SVG FINI");
  // SVG FINI

  // Send to AWS
  logIt(FIG, "AWS START");
  // await aws_01();
  // await aws_02();
  // await aws_03();
  logIt(FIG, "AWS FINI");
  // AWS Fini
})();

export {
  task_01,
  task_02,
  task_03,
  task_04,
  fxtask_05,
  fxtask_06,
  fxtask_07,
  fxtask_08,
  fxtask_09,
  fxtask_10,
  fxtask_11,
  script_01,
  script_02,
  script_03,
  script_04,
  copyRight_00,
  web_01,
  aws_01,
  aws_02,
  aws_03,
  svg_01,
};
