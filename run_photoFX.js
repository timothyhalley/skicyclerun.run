// Purpose: FX library for processing photos
// * Use of JIMP to add special effects to photos

export { photoFXGreyScale, photoFXSepia, photoFXPoster, photoFXPencil };

import jimp from "jimp";
import * as _xo from "./run_Utilities.js";
import * as _db from "./run_LowDB.js";

const sleep = (ms = 1000 * Math.random() + 900) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function setOutName(photo, style) {
  let outPath = photo.replace("2_ScalePhotos", "3_FXRepo");
  let outFile = outPath.split("/").pop();

  let stub = style + ".";
  let newFile = outFile.replace(".", stub);

  let finalPath = outPath.replace(outFile, newFile);

  return finalPath;
}
async function photoFXGreyScale(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_GS");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genGreyScale(photoIn, photoOut);
  // await _db.db_addNewPath(pObj, "FX_GS", photoOut);
}

async function photoFXSepia(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_SP");
  await genSepia(photoIn, photoOut);
  // await _db.db_addNewPath(pObj, "FX_SP", photoOut);
}

async function photoFXPoster(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_PO");
  await genPoster(photoIn, photoOut);
  // await _db.db_addNewPath(pObj, "FX_PO", photoOut);
}

async function photoFXPencil(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_PC");
  await genPencil(photoIn, photoOut);
  // await _db.db_addNewPath(pObj, "FX_PC", photoOut);
}

// **** ----
async function genGreyScale(photoIn, photoOut) {
  try {
    const image = await jimp.read(photoIn);
    await image.greyscale().write(photoOut);
  } catch (err) {
    console.log(err);
  }
}

async function genSepia(photoIn, photoOut) {
  try {
    const image = await jimp.read(photoIn);
    await image.sepia().write(photoOut);
  } catch (err) {
    console.log(err);
  }
}

async function genPoster(photoIn, photoOut) {
  try {
    const image = await jimp.read(photoIn);
    await image.posterize(7.5).write(photoOut);
  } catch (err) {
    console.log(err);
  }
}

async function genPencil(photoIn, photoOut) {
  try {
    const image = await jimp.read(photoIn);
    await image
      .color([
        { apply: "desaturate", params: [90] },
        { apply: "brighten", params: [22] },
        { apply: "shade", params: [10] },
      ])
      .write(photoOut);
  } catch (err) {
    console.log(err);
  }
}
