// Purpose: Convert specific images to SVG for optimal web page displays

import { execa, execaCommand } from "execa";
import * as _xo from "./run_utilites.js";
import * as _utl from "./run_photolib.js";
import * as _db from "./run_lowdb.js";
import { logit } from "./run_logutil.js";

// Node modules
import path from "node:path";
const svgX = /SVG/g;

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { runSVG };

// Locate all images in Photo DB with SVG in path to process
async function runSVG(svgDir) {
  logit(SLL, "start", "Generate SVG - Start");

  let numPhotos = 0;

  // Get all photos in JSON DB
  let photos = await _xo.getDirFiles(svgDir, "JPEG", "JPG", "GIF");
  for (const photo of photos) {
    let pathObj = path.parse(photo);
    let pathDir = pathObj.dir;
    if (pathDir.match(svgX) !== null) {
      let photoIn = photo;
      let photoOut = pathObj.dir + path.sep + pathObj.name + ".svg";
      logit(SLL, "info", `Converting: ${pathObj.name} to SVG format`);
      try {
        const { stdout } = await execaCommand(
          `magick convert ${photoIn} ${photoOut}`
        );
      } catch (err) {
        console.log(err);
      }
      numPhotos++;
    }
  }
  logit(SLL, "stop", "Generate SVG - Fini");
  return numPhotos;
}
