// Purpose: EXECA Script Runner
// http://www.fmwconcepts.com/imagemagick/index.php
// https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/

import { execa, execaCommand } from 'execa';
import { logit } from './run_logutil.js';
import * as _xo from './run_utilites.js'
import * as _db from './run_lowdb.js';
const ERR = 'err';
const BOX = 'box';
const LOG = 'log';
const FIG = 'fig';
const BUG = 'debug';
const SLL = 'sllog';

export { runScript }

const sleep = (ms = 1000 * Math.random() + 900) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// ** Master Queue for files --> scripts
async function runScript(script) {

    await _db.db_Load()
    let pDB = await _db.db_getPhotos()
    let numPhotos = 0
    let fSize = 0.0
    logit(SLL, 'start', `Script: ${script} GOGO`)
    for (const pObj of pDB) {
        numPhotos++
        switch (script) {
            case 'watercolor':
                fSize = await runWaterColor(pObj)
                break;

            case 'sketching':
                fSize = await runSketching(pObj)
                break;

            case 'tinyplanet':
                let check4Pano = (pObj.size.width / pObj.size.height).toFixed(2)
                if (check4Pano >= 3) {
                    fSize = await runTinyPlanet(pObj)
                }
                break;

            case 'noOpt':
            default:
                logit(FIG, "ERROR")
                logit(ERR, 'runScripts:runScript', 'No Script defined')
                break;
        }
        // await sleep(1000)
        logit(SLL, 'info', `photo: ${numPhotos} of ${pDB.length} → ${pObj.info.name} - Script ${script} w/ filesize: ${fSize}`)
    }

    logit(SLL, 'stop', `Script: ${script} FINI`)
    return numPhotos

}

// -------------------------------------
async function setOutName(photo, style) {

    let outPath = photo.replace('2_ScalePhotos', '3_FXRepo')
    let outFile = outPath.split('/').pop()

    let stub = style + '.'
    let newFile = outFile.replace('.', stub)

    let finalPath = outPath.replace(outFile, newFile)

    return finalPath

}

//    --------------------------------------------------------------------------------------

//
// **** START: WATERCOLOR
//
async function runWaterColor(pObj) {
    let photoIn = pObj.info.paths.scale;
    let photoOut = await setOutName(photoIn, '_WC')
    await _xo.checkDirectory(photoOut) // need only the first FX to set album directories
    let fSize = await genWaterColor(photoIn, photoOut)
    return fSize
}
// +++++++++++++++++++++++++++++++++
async function genWaterColor(photoIn, photoOut) {
    let fSize = 0.0
    try {
        // USAGE: watercolor [-s smoothing] [-e edge] [-m mixing] [-c contrast] infile outfile
        const { stdout } = await execaCommand(`./scripts/watercolor.sh ${photoIn} ${photoOut}`);
        fSize = (stdout / 1000).toFixed(2)
    } catch (err) {
        console.log(err)
    }
    return fSize
}
//
// **** END: WATERCOLOR
//

//    --------------------------------------------------------------------------------------

//
// **** START: SKETCHING
//
async function runSketching(pObj) {
    let photoIn = pObj.info.paths.scale;
    let photoOut = await setOutName(photoIn, '_SK')
    await _xo.checkDirectory(photoOut) // need only the first FX to set album directories
    let fSize = await genSchetching(photoIn, photoOut)
    return fSize
}
// +++++++++++++++++++++++++++++++++
async function genSchetching(photoIn, photoOut) {
    let fSize = 0.0
    try {
        // USAGE: sketching [-d detail] [-e edge] [-c coloring] [-s saturation] infile outfile
        const { stdout } = await execaCommand(`./scripts/sketching.sh ${photoIn} ${photoOut}`);
        fSize = (stdout / 1000).toFixed(2)
    } catch (err) {
        console.log(err)
    }
    return fSize
}
//
// **** END: WATERCOLOR
//

//    --------------------------------------------------------------------------------------

//
// **** START: PANO2FISHEYE
//
async function runTinyPlanet(pObj) {
    let photoIn = pObj.info.paths.scale;
    let photoOut = await setOutName(photoIn, '_P2F')
    await _xo.checkDirectory(photoOut) // need only the first FX to set album directories
    let fSize = await genTinyPlanet(photoIn, photoOut)
    return fSize
}
// +++++++++++++++++++++++++++++++++
async function genTinyPlanet(photoIn, photoOut) {
    let fSize = 0.0
    try {
        // USAGE: tinyplanet [-d dimension] [-b bgcolor] [-r rotate] [-f fade] [-s smooth] [-t threshold] [-n newseed] [-I increment] [-D delay] [-L loop] infile outfile
        const { stdout } = await execaCommand(`./scripts/tinyplanet.sh ${photoIn} ${photoOut}`);
        fSize = (stdout / 1000).toFixed(2)
    } catch (err) {
        console.log(err)
    }
    return fSize
}
//
// **** END: PANO2FISHEYE
//

//    --------------------------------------------------------------------------------------
