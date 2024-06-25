// Purpose: Ready images to send to web
// https://flatlogic.com/blog/12-javascript-image-manipulation-libraries-for-your-next-web-app/
// https://medium.com/geekculture/upload-compress-and-delete-images-in-a-aws-s3-bucket-with-node-js-express-ba29d288b129

// import * as _utl from './run_photolib.js';
import * as _xo from "./lib_Utilities.js";
import * as _utl from "./lib_PhotoLib.js";
import * as _db from "./lib_LowDB.js";
import { logIt } from "./lib_LogUtil.js";

// Node modules
import path from "node:path";

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { runWeb };

// Master queue to process images
async function runWeb(dirIn, fxDir, dirOut) {
  const P_MAXWIDTH = 1024;
  const P_MAXHEIGHT = 1024;
  const photoDir = dirIn + fxDir;
  let numPhotos = 0;
  let mbSaved = 0;
  let photos = await _xo.getDirFiles(photoDir, "JPEG", "JPG", "GIF");
  logIt(SLL, "start", "Photo Compress - Start");

  for (const inPhoto of photos) {
    let smlFile = inPhoto.split("/").pop();

    let inStat = await _xo.getFileInfo(inPhoto);
    let inFileSz = await _utl.getPhotoSize(inPhoto);
    let outPhotoSz = await _utl.calcImageScale2(
      inFileSz.width,
      inFileSz.height,
      P_MAXWIDTH,
      P_MAXHEIGHT
    );

    let outPhoto = inPhoto.replace(dirIn, dirOut);
    outPhoto = outPhoto.replace(fxDir, "");
    await _xo.checkDirectory(outPhoto);

    logIt(
      SLL,
      "info",
      `Compressing: ${smlFile} (ratio: W:${inFileSz.width}➡${outPhotoSz.width
      } H:${inFileSz.height}➡${outPhotoSz.height}) - total: ${_xo.niceBytes(
        mbSaved
      )}`
    );
    await _utl.photoCompress(inPhoto, outPhotoSz, outPhoto);

    let dbSuffix =
      "web_" +
      outPhoto.substring(outPhoto.lastIndexOf("_") + 1, outPhoto.length - 5);
    let photoID = getPhotoIDbyPath(inPhoto);
    let pObj = await _db.db_getPhotoByName(photoID);
    await _db.db_addNewPath(pObj, dbSuffix, outPhoto);

    let outStat = await _xo.getFileInfo(outPhoto);
    mbSaved = mbSaved + parseInt(inStat.fsz - outStat.fsz);
    numPhotos++;
  }
  logIt(SLL, "stop", "Photo Compress - Fini");
  let totalBytesSaved = _xo.niceBytes(mbSaved);
  return [numPhotos, totalBytesSaved];
}

function getPhotoIDbyPath(photo) {
  let pObj = path.parse(photo);
  let name = pObj.name;
  let pID = name.substring(0, name.lastIndexOf("_"));

  return pID;
}
