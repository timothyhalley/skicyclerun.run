// Purpose: Convert specific images to SVG for optimal web page displays

import { execa, execaCommand } from "execa";
import * as _xo from "./lib_Utilities.js";
import * as _utl from "./lib_PhotoLib.js";
import * as _db from "./lib_LowDB.js";
import { logIt } from "./lib_LogUtil.js";

// Node modules
import path from "node:path";
const svgX = /SVG/gi;

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { runSVG };

// Locate all images in Photo DB with SVG in path to process
async function runSVG(svgDir, outDir) {
  logIt(SLL, "start", "Generate SVG - Start");

  // Create output directory if not there
  const svgDirName = await _xo.getDirName(svgDir);
  await _xo.checkDirectory(outDir + path.sep + svgDirName);

  let numPhotos = 0;

  // Get all photos in JSON DB
  let photos = await _xo.getDirFiles(svgDir, "JPEG", "JPG", "GIF");
  for (const photo of photos) {
    let pathObj = path.parse(photo);
    let pathDir = pathObj.dir;
    if (pathDir.match(svgX) !== null) {
      let photoIn = photo;
      let photoBMP = outDir + path.sep + svgDirName + path.sep + pathObj.name + ".bmp";
      let photoSVG = outDir + path.sep + svgDirName + path.sep + pathObj.name + ".svg";
      logIt(SLL, "info", `Converting: ${pathObj.name} to BMP & SVG format`);
      try {
        await execaCommand(
          `magick convert ${photoIn} ${photoBMP}`
        );
        await execaCommand(
          `potrace -s ${photoBMP} -o ${photoSVG}`
        );
        await execaCommand(
          `rm ${photoBMP}`
        );
      } catch (err) {
        console.log(err);
      }
      numPhotos++;
    }
  }
  logIt(SLL, "stop", "Generate SVG - Fini");
  return numPhotos;
}