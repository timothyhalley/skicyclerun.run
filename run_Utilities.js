// Purpose: Low level utilites for run tools
// * Generic utilies for tools
//      * clean temporary directories & scale photos with watermark for FX series.
//      * SHARP library only https://sharp.pixelplumbing.com/

export {
  niceBytes,
  checkDirectory,
  cleanDirectories,
  countDirFiles,
  getDirFiles,
  getFileInfo,
  copyFile,
  getFileType,
  getDirName,
};

import { deleteAsync } from "del"; // https://www.npmjs.com/package/del
import fg from "fast-glob";
import path from "node:path";
import fsp from "node:fs/promises";

import { logIt } from "./run_LogUtil.js";

const LOG = "log";
const FIG = "fig";
const ERR = "err";
const BUG = "debug";
const SLL = "sllog";

function niceBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

async function copyFile(scrFile, newFile) {
  try {
    return await fsp.cp(scrFile, newFile);
  } catch (err) {
    logIt(FIG, "ERROR");
    logIt(ERR, "run_utilites:copyFile", err);
    return null;
  }
}
async function getFileInfo(filepath) {
  let fileStat = await fsp.stat(filepath);

  let pFile = {
    fid: fileStat.ino,
    fsz: fileStat.size,
    ftm: fileStat.birthtime,
    fdv: fileStat.dev,
  };

  return pFile;
}
async function checkDirectory(dirPath) {
  let dirName = dirPath;
  if (path.extname(dirPath)) {
    dirName = path.dirname(dirPath);
  }

  try {
    await fsp.access(dirName); //, constants.R_OK | constants.W_OK
  } catch (err) {
    // note: per MDN - 'this is the way' to run on error from access --> MKDIR
    // logIt(LOG, 'Directory does not exist: ', fotoDir)
    await makeDirectory(dirName);
  }
}

async function makeDirectory(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
  } catch (err) {
    logIt(FIG, "ERROR");
    logIt(ERR, "run_utilites:makeDirectory", err);
  }
}

async function getDirFiles(srcDir, ...srcType) {
  let newExt = [];
  let cnt = 0;
  for (let ext of srcType) {
    newExt[cnt++] = ext.toLowerCase();
  }
  const srcDirFiles = srcDir + "/**/*.{" + newExt + "}";

  try {
    return await fg([srcDirFiles], { absolute: false });
  } catch (err) {
    logIt(ERR, err);
    return null;
  }
}

async function cleanDirectories(dirs) {
  let deletedDirectoryPaths = [];
  try {
    deletedDirectoryPaths = await deleteAsync(dirs);
  } catch (err) {
    logIt(ERR, err);
    deletedDirectoryPaths = null;
  }

  return deletedDirectoryPaths;
}

async function countDirFiles(dir) {
  let fPath = dir + "/*/**";

  try {
    let fileCount = await fg([fPath]);
    return fileCount.length;
  } catch (err) {
    logIt(ERR, err);
    return null;
  }
}

async function getFileType(fpath) {
  let fileEXT = path.extname(fpath).slice(1).toLocaleLowerCase("en-US");

  return fileEXT;
}

async function getDirName(dirPath) {
  return dirPath.split(path.sep).pop();
}
