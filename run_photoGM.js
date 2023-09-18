// Purpose: GM library for processing photos
// * Use of GraphicsMagic and ImageMagick via plug GM to add special effects to photos
// http://www.fmwconcepts.com/imagemagick/index.php

export { charcoal, waterColor };

import gm from "gm";
import { logit } from "./run_logutil.js";
import * as _xo from "./run_utilites.js";

const LOG = "log";
const FIG = "fig";
const ERR = "err";
const BUG = "debug";
const SLL = "sllog";

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
async function waterColor(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_FC");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genWaterColor(photoIn, photoOut);
}
async function charcoal(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_CC");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genCharcoal(photoIn, photoOut);
}

// **** ----
async function genWaterColor(photoIn, photoOut) {
  try {
    const image = await gm(photoIn);
    await image
      .flatten()
      .edge(1)
      .equalize()
      .contrast(5)
      .write(photoOut, function (err) {
        if (err) {
          logit(FIG, "ERROR");
          logit(ERR, "genWaterColor", err);
        }
      });
  } catch (err) {
    console.log(err);
  }
}

async function genCharcoal(photoIn, photoOut) {
  try {
    const image = await gm(photoIn);
    await image.charcoal(0.95).write(photoOut, function (err) {
      if (err) {
        logit(FIG, "ERROR: genCharcoal");
        logit(ERR, "genCharcoal", err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
