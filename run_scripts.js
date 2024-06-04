// Purpose: EXECA Script Runner
// http://www.fmwconcepts.com/imagemagick/index.php
// https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/

import { execa, execaCommand } from "execa";
import { logIt } from "./run_LogUtil.js";
import * as _xo from "./run_Utilities.js";
import * as _db from "./run_LowDB.js";
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { runScript };

const sleep = (ms = 1000 * Math.random() + 900) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ** Master Queue for files --> scripts
async function runScript(script) {
  await _db.db_Load();
  let pDB = await _db.db_getPhotos();
  let numPhotos = 0;
  let fSize = 0.0;
  logIt(SLL, "start", `Script: ${script} GOGO`);
  for (const pObj of pDB) {
    numPhotos++;
    switch (script) {
      case "watercolor":
        fSize = await runWaterColor(pObj);
        break;

      case "sketching":
        fSize = await runSketching(pObj);
        break;

      case "tinyplanet":
        let check4Pano = (pObj.size.width / pObj.size.height).toFixed(2);
        if (check4Pano >= 3) {
          fSize = await runTinyPlanet(pObj);
        }
        break;

      case "sharpedge":
        fSize = await runSharpEdge(pObj);
        break;

      case "noOpt":
      default:
        logIt(FIG, "ERROR");
        logIt(ERR, "runScripts:runScript", "No Script defined");
        break;
    }
    // await sleep(1000)
    logIt(
      SLL,
      "info",
      `photo: ${numPhotos} of ${pDB.length} → ${pObj.info.name} - Script ${script} w/ filesize: ${fSize}`
    );
  }

  logIt(SLL, "stop", `Script: ${script} FINI`);
  return numPhotos;
}

// -------------------------------------
async function setOutName(photo, style) {
  let outPath = photo.replace("2_ScalePhotos", "3_FXRepo");
  let outFile = outPath.split("/").pop();

  let stub = style + ".";
  let newFile = outFile.replace(".", stub);

  let finalPath = outPath.replace(outFile, newFile);

  return finalPath;
}

//    --------------------------------------------------------------------------------------

//
// **** START: WATERCOLOR
//
async function runWaterColor(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_WC1");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  let fSize = await genWaterColor(photoIn, photoOut);
  return fSize;
}
// +++++++++++++++++++++++++++++++++
async function genWaterColor(photoIn, photoOut) {
  let fSize = 0.0;
  try {
    // USAGE: watercolor [-s smoothing] [-e edge] [-m mixing] [-c contrast] infile outfile
    const { stdout } = await execaCommand(
      `./scripts/watercolor.sh -s 5 -e 5 -m 33 -c 5 ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
//
// **** END: WATERCOLOR
//

//    --------------------------------------------------------------------------------------

//
// **** START: SKETCH-SUITE
//
async function runSketching(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_SK1");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  let fSize = await genSchetching(photoIn, photoOut);

  photoOut = await setOutName(photoIn, "_SK2");
  fSize = +(await genSchetchEtch(photoIn, photoOut));

  photoOut = await setOutName(photoIn, "_SK3");
  fSize = +(await genSchetch(photoIn, photoOut));

  return fSize;
}
// +++++++++++++++++++++++++++++++++
async function genSchetching(photoIn, photoOut) {
  let fSize = 0.0;
  try {
    // USAGE: sketching [-d detail] [-e edge] [-c coloring] [-s saturation] infile outfile
    const { stdout } = await execaCommand(
      `./scripts/sketching.sh ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
async function genSchetchEtch(photoIn, photoOut) {
  let fSize = 0.0;
  try {
    // USAGE: sketching [-d detail] [-e edge] [-c coloring] [-s saturation] infile outfile
    const { stdout } = await execaCommand(
      `./scripts/sketchetch.sh ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
async function genSchetch(photoIn, photoOut) {
  let fSize = 0.0;
  try {
    // USAGE: sketchetch [-m mode] [-e etch] [-B brightness] [-S saturation] [-h hue] [-c color] [-C coloramt] [-t type] [infile] [outfile]
    const { stdout } = await execaCommand(
      `./scripts/sketch.sh ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
//
// **** END: SKETCH-SUITE
//

//    --------------------------------------------------------------------------------------

//
// **** START: PANO2FISHEYE
//
async function runTinyPlanet(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_P2F");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  let fSize = await genTinyPlanet(photoIn, photoOut);
  return fSize;
}
// +++++++++++++++++++++++++++++++++
async function genTinyPlanet(photoIn, photoOut) {
  let fSize = 0.0;
  try {
    // USAGE: tinyplanet [-d dimension] [-b bgcolor] [-r rotate] [-f fade] [-s smooth] [-t threshold] [-n newseed] [-I increment] [-D delay] [-L loop] infile outfile
    const { stdout } = await execaCommand(
      `./scripts/tinyplanet.sh ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
//
// **** END: PANO2FISHEYE
//

//    --------------------------------------------------------------------------------------
//
// **** START: SHARPEDGE
//
async function runSharpEdge(pObj) {
  let photoIn = pObj.info.paths.scale;
  let photoOut = await setOutName(photoIn, "_SE");
  await _xo.checkDirectory(photoOut); // need only the first FX to set album directories
  let fSize = await genSharpEdge(photoIn, photoOut);
  return fSize;
}
// +++++++++++++++++++++++++++++++++
async function genSharpEdge(photoIn, photoOut) {
  let fSize = 0.0;
  // console.log("TEST OUT:\n", photoIn, '\n', photoOut)
  try {
    // USAGE: stainedglass [-k kind] [-s size] [-o offset] [-n ncolors] [-b bright] [-e ecolor] [-t thick] [-r rseed] [-a] infile outfile
    const { stdout } = await execaCommand(
      `./scripts/sharpedge.sh -k uniform -e 0 -f 1 -t 25 ${photoIn} ${photoOut}`
    );
    fSize = (stdout / 1000).toFixed(2);
  } catch (err) {
    console.log(err);
  }
  return fSize;
}
//
// **** END: SKETCHING
//
