// Purpose: GM library for processing photos
// * Use of GraphicsMagic and ImageMagick via plug GM to add special effects to photos
// http://www.fmwconcepts.com/imagemagick/index.php

export { charcoal, waterColor, transparent };

import gm from "gm";
import { logit } from "./run_logUtil.js";
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
  let photoOut = await setOutName(photoIn, "_WC2");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genWaterColor(photoIn, photoOut);
}
async function charcoal(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_CC");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genCharcoal(photoIn, photoOut);
}
async function transparent(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_TP");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  await genCharcoal(photoIn, photoOut);
}

// **** ----
async function genWaterColor(photoIn, photoOut) {
  try {
    const image = await gm(photoIn);
    await image

      //.noise('laplacian') // Add noise to simulate the watercolor texture
      //.modulate(120, 100) // Slightly increase brightness and maintain color saturation
      // .gaussian(2, 0) // Apply a mild Gaussian blur to soften the image
      .paint(2) // Apply a slight paint effect to simulate brush strokes
      .unsharp(1) // Sharpen the edges
      .modulate(120, 110)
      // .contrast(10) // Slightly decrease contrast for a softer effect
      //
      // .noise('laplacian') // Add noise to simulate the watercolor texture
      // .edge(1) // Apply a slight edge to enhance details
      // .modulate(100, 120) // Adjust brightness and saturation
      // .contrast(-5) // Slightly reduce contrast
      //
      // .modulate(120, 80, 100) // Adjust brightness and saturation
      // .gaussian(20, 5) // Apply a Gaussian blur with reduced intensity
      // .paint(2) // Increase the paint radius for a stronger brush effect
      // V2 - completely black!
      // .colorize(150, 100, 200) // Adjust the color to a lighter palette
      // .paint(7) // Apply a paint-like effect to blur the image
      // .edge(3) // Add some edge definition if desired
      // V1 - really dark lines
      // .flatten()
      // .edge(1)
      // .equalize()
      // .contrast(5)
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

async function genTransparent(photoIn, photoOut) {
  try {
    const image = await gm(photoIn);
    await image.transparent('white').write(photoOut, function (err) {
      if (err) {
        logit(FIG, "ERROR: genTransparent");
        logit(ERR, "genTransparent", err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
