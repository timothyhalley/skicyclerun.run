// Purpose: function library for processing photos
// * Prep picture for web use
//      * clean temporary directories & scale photos with watermark for FX series.
//      * SHARP library only https://sharp.pixelplumbing.com/

export {
  resetAll,
  getDBSize,
  photoData,
  photoRename,
  photoScale,
  photoFXMaker,
  photoFXGreyScale,
  photoCompress,
  getPhotoExif,
  getPhotoSize,
  calcImageScale,
};

// Node modules
import path from "node:path";

// NPM Modules
import _ from "underscore";
import sharp from "sharp";
import exifr from "exifr";
import imageSize from "image-size";

// Custom imports:
import { gmapLoactions, gmapElevation, gmapTimeZone } from "./run_google.js";
import * as _db from "./run_lowdb.js";
import * as _fx from "./run_photoFX.js";
import * as _gm from "./run_photoGM.js";
import * as _xo from "./run_utilites.js";
import { logit } from "./run_logutil.js";

const LOG = "log";
const FIG = "fig";
const ERR = "err";
const BUG = "debug";
const SLL = "sllog";

// ***
// *** --- photo library utilities
async function resetAll(PHOTOWEB, PHOTOTMP) {
  // Empty JSON DB
  await _db.db_Init();

  // Remove tmp directories & photos
  const dirs = [PHOTOWEB, PHOTOTMP];
  let dirList = await _xo.cleanDirectories(dirs);
  if (dirList.length > 0) {
    dirList = dirList[0].split("/").pop();
  } else {
    dirList = "no temp dir found";
  }

  return dirList;
}

async function getDBSize() {
  return _db.db_Size();
}

async function photoData(photos) {
  let pCnt = 0;

  logit(SLL, "start", "Photo Data - Start");
  for (const photo of photos) {
    logit(SLL, "info", photo);
    let picData = await getPhotoData(photo);
    // console.log('Debug: ➡️ ', picData)
    await _db.db_Upsert(picData);
    pCnt = pCnt + 1;
  }
  logit(SLL, "stop", "Photo Data - Fini");
  return pCnt;
}

async function photoRename(tmpDir) {
  const outDir = tmpDir + "/1_RenamePhotos/";
  await _xo.checkDirectory(outDir); // Make directory for process
  var numFotos = 0;

  let photos = await _db.db_getPhotos();

  logit(SLL, "start", "Photo Rename: Start");
  for (const photo of photos) {
    logit(SLL, "info", photo.info.image);
    await setRenamePhoto(outDir, photo);
    numFotos = numFotos + 1;
  }
  logit(SLL, "stop", "Photo Rename: Fini");
  return numFotos;
}

async function photoScale(tmpDir) {
  let outDir = tmpDir + "/2_ScalePhotos";
  await _xo.checkDirectory(outDir); // Make directory for process

  let pDB = await _db.db_getPhotos();
  let numPhotos = 0;
  logit(SLL, "start", "Photo Scale - Start");

  for (const pObj of pDB) {
    numPhotos++;
    logit(
      SLL,
      "info",
      `photo: ${numPhotos} of ${pDB.length}\t → ${pObj.info.name}`
    );
    await setPhotoResize(pObj);
    logit(SLL, "info", `photo: ${pObj.info.name} - COMPLETE`);
    // await sleep(1000)
  }

  logit(SLL, "stop", "Photo Scale - Fini");
  return numPhotos;
}

async function photoFXGreyScale(tmpDir) {
  let outDir = tmpDir + "/3_FXRepo";
  await _xo.checkDirectory(outDir); // Make directory for process

  let pDB = await _db.db_getPhotos();
  let numPhotos = 0;
  logit(SLL, "start", "Photo Grey Scale - Start");

  for (const pObj of pDB) {
    numPhotos++;
    logit(
      SLL,
      "info",
      `photo: ${numPhotos} of ${pDB.length}\t → ${pObj.info.name}`
    );
    await _fx.photoFXGreyScale(pObj);
    // await sleep(1000)
  }

  logit(SLL, "stop", "Photo Grey Scale - Fini");
  return numPhotos;
}

async function photoFXMaker(tmpDir, FXStyle) {
  let outDir = tmpDir + "/3_FXRepo";
  await _xo.checkDirectory(outDir); // Make directory for process

  let pDB = await _db.db_getPhotos();
  let numPhotos = 0;
  logit(SLL, "start", `Photo FX: ${FXStyle}`);

  for (const pObj of pDB) {
    numPhotos++;
    logit(
      SLL,
      "info",
      `photo: ${numPhotos} of ${pDB.length}\t → ${pObj.info.name}`
    );
    switch (FXStyle) {
      case "GreyScale":
        await _fx.photoFXGreyScale(pObj);
        break;

      case "Sepia":
        await _fx.photoFXSepia(pObj);
        break;

      case "Poster":
        await _fx.photoFXPoster(pObj);
        break;

      case "Pencil":
        await _fx.photoFXPencil(pObj);
        break;

      case "Watercolor":
        await _gm.waterColor(pObj);
        break;

      case "Charcoal":
        await _gm.charcoal(pObj);
        break;

      case "noOpt":
      default:
        logit(ERR, "photoFXMaker", "No FX defined");
        break;
    }
    // await sleep(1000)
  }

  logit(SLL, "stop", `Photo FX FINI: ${FXStyle}`);
  return numPhotos;
}

//************************************** */
// *** Helper Functions
//*** */
async function setRenamePhoto(outDir, photo) {
  const SPACE = /\s/g;
  let info = photo.info;
  let ogFile = _.values(_.pick(info.paths, "orig")).toString();

  if (_.has(info.paths, "orig")) {
    let album = _.values(_.pick(info, "album")).toString().replace(SPACE, "");
    let opath = _.values(_.pick(info.paths, "orig"))
      .toString()
      .replace(SPACE, "");
    let name = _.values(_.pick(info, "name")).toString().replace(SPACE, "");
    let fExt = path.extname(opath);
    let newPath = outDir + album + "/" + name + fExt;
    await _xo.checkDirectory(newPath);
    try {
      let cpStat = await _xo.copyFile(ogFile, newPath);
      logit(SLL, "info", "CP file: ", ogFile, newPath, cpStat);
      // add new path to info section
      await _db.db_addNewPath(photo, "copy", newPath);
    } catch (err) {
      logit(FIG, "ERROR!");
      logit(ERR, err);
    }
  } else {
    logit(FIG, "ERROR!");
    logit(
      ERR,
      "Path missing or incomplete to copy file to TMP area for processing."
    );
  }
}

async function getPhotoExif(filepath) {
  let exifTypes = ["jpg", "jpeg", "tiff", "heif", "heic", "png"];
  let fileEXT = await _xo.getFileType(filepath);
  const found = exifTypes.find((element) => element == fileEXT);

  let pExif = null;
  if (found !== undefined) {
    pExif = await exifr.parse(filepath, [
      "Make",
      "Model",
      "ExifImageWidth",
      "ExifImageHeight",
      "DateTimeOriginal",
      "ModifyDate",
      "CreateDate",
      "OffsetTime",
      "OffsetTimeOriginal",
      "GPSDateStamp",
      "GPSLatitudeRef",
      "GPSLatitude",
      "GPSLongitudeRef",
      "GPSLongitude",
      "GPSAltitudeRef",
      "GPSAltitude",
      "GPSSpeedRef",
      "GPSSpeed",
      "GPSImgDirectionRef",
      "GPSImgDirection",
      "GPSDateStamp",
      "GPSHPositioningError",
      "latitude",
      "longitude",
    ]);
  } else {
    let pFile = await _xo.getFileInfo(filepath);
    pExif = await getDefaultEXIF(filepath, pFile.ftm);
  }

  return pExif;
}

async function getPhotoData(filepath) {
  logit(SLL, "Photo:", filepath);
  // Get info from path: album and filename
  let pFile = await _xo.getFileInfo(filepath);

  // Get EXIF data from photo
  // let pExif = await exifr.parse(filepath);
  let pExif = await getPhotoExif(filepath);

  // Get date from EXIF
  const ogDate = setPhotoDate(pExif);

  // Format date for filename
  const ogDateJSON = ogDate.toJSON();
  let ogDateYMD = ogDateJSON.replace(/-*T*:*/gm, "");
  ogDateYMD = ogDateYMD.replace(/\.[0-9]{3}Z*/gm, "");

  // Format path for album name and other items
  let tmpArr = filepath.split("/");

  // Set path to root level
  let pathAlbum = null;
  if (tmpArr.length > 3) {
    pathAlbum = tmpArr[tmpArr.length - 2];
  }
  let pathImage = tmpArr[tmpArr.length - 1];

  let pPath = {
    album: pathAlbum,
    image: pathImage,
    paths: {
      orig: filepath,
      copy: null,
      scale: null,
    },
    name: ogDateYMD,
  };

  // Get location information from photo
  let pLoc = await getPhotolocations(pExif.latitude, pExif.longitude, ogDate);

  // Get image size
  let pSize = await calcImageScale(
    pExif.ExifImageWidth,
    pExif.ExifImageHeight,
    100
  ); // 100%

  let pData = {
    // uuid: uuid(5, 1),
    uuid: pFile.fdv + "-" + pFile.fid,
    nameID: pPath.name,
    file: pFile,
    info: pPath,
    data: pExif,
    locn: pLoc,
    size: pSize,
  };

  return pData;
}

function setPhotoDate(exifObj) {
  const regex = /Date/g;
  const isDate = (date) => {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
  };
  const isDateTime = (date) => {
    try {
      return (
        new Date(date) !== "Invalid Date" &&
        !isNaN(new Date(date)) &&
        !(date.getTime() instanceof ReferenceError)
      );
    } catch (err) {
      return false;
    }
  };

  const isOlder = (d1, d2) => {
    if (d1.getTime() <= d2.getTime()) {
      return true;
    } else {
      return false;
    }
  };

  let ogDate = new Date(Date.now());

  for (let og in exifObj) {
    if (og.search(regex) > 0) {
      let ogProp = exifObj[og];
      if (isDateTime(ogProp)) {
        let newDate = new Date(ogProp);
        if (isOlder(newDate, ogDate)) {
          ogDate = newDate;
        }
      }
    }
  }

  return ogDate; // return GMT offset
}

async function getPhotoSize(photo) {
  return imageSize(photo);
}

async function setPhotoResize(pObj) {
  // consider --> https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/

  try {
    let width = pObj.size.width;
    let height = pObj.size.height;
    let photoPath = pObj.info.paths.copy;

    let newPhotoPath = photoPath.replace("1_RenamePhotos", "2_ScalePhotos");

    await _xo.checkDirectory(newPhotoPath); // create any new album folders for SHARP

    let svgImage = await svgText2Image(pObj);
    const svgBuffer = Buffer.from(svgImage);
    // console.log(`DEBUG: ${pObj.info.image} - has a w/h of: ${width} & ${height}`)
    await sharp(photoPath)
      .resize({
        width: width,
        height: height,
        kernel: sharp.kernel.nearest,
        fit: "inside",
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
      })
      .composite([
        // { input: './skicyclerun_logo.png', top: 75, left: 75, title: true },
        { input: svgBuffer, top: 10, left: 10, title: true },
      ])
      .withMetadata()
      .jpeg({
        quality: 100,
      })
      .toFile(newPhotoPath);

    await _db.db_addNewPath(pObj, "scale", newPhotoPath);
    // console.log('DONE')
  } catch (err) {
    logit(ERR, "photoLib:setPhotoScale", err);
  }
}

async function svgText2Image(pObj) {
  // https://jakearchibald.github.io/svgomg/
  // https://vectr.com/design/editor

  const svgWidth = (pObj.size.width * 0.28).toFixed();
  const svgHeight = (pObj.size.height * 0.1).toFixed();
  const svgElev = pObj.locn.elevation.toFixed(2);
  let svgLoc = pObj.locn.locations;
  svgLoc = svgLoc.replace(/[A-Z]*[0-9]|[A-Z]*\+[A-Z]|[A-Z]*\+/g, "");
  let svgTxt = svgLoc.split(",");

  var svgCountry = svgTxt.length >= 0 ? svgTxt.pop() : "Earth";
  var svgState = svgTxt.length >= 0 ? svgTxt.pop() : "Wind";
  var svgLocation = svgTxt.length >= 0 ? svgTxt.pop() : "Fire";

  const svgImage = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <title>SkiCycleRun</title>
        <style>
            .small { font: italic 18px sans-serif; fill: blue; }
            .heavy { font: bold 30px sans-serif; fill: gold; }
            .strong { font: italic 40px serif; fill: black; }
            .title { font: bold 20px comic; fill=black}
        </style>

        <text x="22" y="35" class="small">In</text>
        <text x="52" y="35" class="heavy">${svgCountry}</text>
        <text x="67" y="55" class="small">at</text>
        <text x="87" y="55" class="strong">${svgLocation} ${svgState}</text>
        <text x="120" y="18" class="title">SkiCycleRun.com ©</text>
    </svg>
    `;

  return svgImage;
}

async function getPhotolocations(lat, lon, photoDate) {
  const sleep = (ms = 1000 * Math.random() + 900) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let pLoc = {
    elevation: null,
    locations: null,
    timezone: null,
  };
  if (lat == null || lon == null) {
    lat = "47.508887"; // HOME BASE
    lon = "-121.984983";
  }

  try {
    pLoc.elevation = await gmapElevation(lat, lon);
    pLoc.locations = await gmapLoactions(lat, lon);
    pLoc.timezone = await gmapTimeZone(lat, lon, photoDate);
    await sleep(222); // pause for google API not to hit threshold limits
  } catch (err) {
    console.error("\n\nERROR: calling gAPI -->", err);
  }
  // console.log('Final Pic Data: ', photoData)
  return pLoc;
}

async function calcImageScale(imgWidth, imgHeight, imgPCT) {
  //https://flothemes.com/flothemes-image-sizes/
  // GRIDSOME: https://gridsome.org/docs/images/
  // The images will be resized down to 480, 1024, 1920 and 2560 pixels by default.

  const maxImg = 2560;
  const regImg = 1920;
  const smlImg = 1024;
  const minImg = 480;

  // ** Helpers ---------------------------- Start:
  const stdImgSize = [2560, 1920, 1024, 480, 256];
  const calc = {
    maxImg: 2560,
    regImg: 1920,
    smlImg: 1024,
    minImg: 480,
    aspectRatio: (imgW, imgH) => imgW / imgH,
    newHeight: (imgH, imgW, newW) => {
      let newH = Number((imgH / imgW) * newW).toFixed();
      return parseInt(newH);
    },
    calcPCT: (imgPCT) => imgPCT / 100,
    rndNum100: (num) => Math.round(num / 100) * 100,
    inRange: (num, a, b, threshold = 0) =>
      Math.min(a, b) - threshold <= num && num <= Math.max(a, b) + threshold,
    maxWidth: (curWidth) =>
      calc.inRange(curWidth, regImg, maxImg) ? regImg : maxImg,
    regWidth: (curWidth) =>
      calc.inRange(curWidth, smlImg, regImg - 1) ? smlImg : curWidth,
    smlWidth: (curWidth) =>
      calc.inRange(curWidth, minImg, smlImg - 1) ? minImg : curWidth,
  };
  // ** Helpers ---------------------------- :End

  let newWidth = Number(imgWidth * calc.calcPCT(imgPCT)).toFixed(2);
  newWidth = stdImgSize.find((num) => num < newWidth);
  if (newWidth == undefined) {
    newWidth = 256;
    logit(
      ERR,
      `Image width of ${imgWidth} below requirements - forcing to ${newWidth} min size`
    );
  }
  let newHeight = calc.newHeight(imgHeight, imgWidth, newWidth);

  return {
    height: newHeight,
    width: newWidth,
  };
}

async function getDefaultEXIF(photo, picDate) {
  const dimensions = await getPhotoSize(photo);

  let newEXIF = {
    Make: "Apple",
    Model: "iPhone 12 Pro",
    ExifImageWidth: dimensions.width,
    ExifImageHeight: dimensions.height,
    DateTimeOriginal: picDate,
    ModifyDate: picDate.toString(),
    CreateDate: picDate.toString(),
    OffsetTime: "-07:00",
    OffsetTimeOriginal: "-07:00",
    GPSDateStamp: picDate,
    GPSLatitudeRef: "N",
    GPSLatitude: [47, 42, 42.2],
    GPSLongitudeRef: "W",
    "GPSLongitude:": [122, 2, 6.78],
    GPSAltitudeRef: null,
    GPSAltitude: 173.0,
    GPSSpeedRef: "K",
    GPSSpeed: 0,
    GPSImgDirectionRef: "M",
    GPSImgDirection: 247.614,
    GPSDateStamp: picDate,
    GPSHPositioningError: 4.705,
    latitude: 47.71172,
    longitude: -122.0352,
  };
  return newEXIF;
}

async function photoCompress(inPhoto, outDims, outPhoto) {
  try {
    await sharp(inPhoto)
      .resize({
        width: outDims.width,
        height: outDims.height,
        kernel: sharp.kernel.nearest,
        fit: "inside",
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
      })
      .jpeg({ mozjpeg: true })
      .toFile(outPhoto);
  } catch (err) {
    logit(ERR, "photoLib:photoCompress", err);
  }
}
