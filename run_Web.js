// Purpose: Ready images to send to web
// https://flatlogic.com/blog/12-javascript-image-manipulation-libraries-for-your-next-web-app/
// https://medium.com/geekculture/upload-compress-and-delete-images-in-a-aws-s3-bucket-with-node-js-express-ba29d288b129

// import * as _utl from './run_photolib.js';
import * as _xo from './run_utilites.js';
import * as _utl from './run_photolib.js';
import { logit } from './run_logutil.js';

const ERR = 'err';
const BOX = 'box';
const LOG = 'log';
const FIG = 'fig';
const BUG = 'debug';
const SLL = 'sllog';

export { runWeb }

// Master queue to process images
async function runWeb(dirIn, fxDir, dirOut) {

    const REDUX = 95; // % value
    const photoDir = dirIn + fxDir;
    let numPhotos = 0;
    let mbSaved = 0;
    let photos = await _xo.getDirFiles(photoDir, 'JPEG', 'JPG')
    logit(SLL, 'start', 'Photo Compress - Start')

    for (const inPhoto of photos) {

        let smlFile = inPhoto.split('/').pop()

        let inStat = await _xo.getFileInfo(inPhoto)
        let inFileSz = await _utl.getPhotoSize(inPhoto)
        let outPhotoSz = await _utl.calcImageScale(inFileSz.width, inFileSz.height, REDUX)

        let outPhoto = inPhoto.replace(dirIn, dirOut)
        outPhoto = outPhoto.replace(fxDir, '')
        await _xo.checkDirectory(outPhoto)

        logit(SLL, 'info', `Compressing: ${smlFile} (ratio: ${REDUX} - W:${inFileSz.width}➡${outPhotoSz.width} H:${inFileSz.height}➡${outPhotoSz.height}) - total: ${_xo.niceBytes(mbSaved)}`)
        await _utl.photoCompress(inPhoto, outPhotoSz, outPhoto)

        let outStat = await _xo.getFileInfo(outPhoto)
        mbSaved = mbSaved + parseInt(inStat.fsz - outStat.fsz)
        numPhotos++

    }
    logit(SLL, 'stop', 'Photo Compress - Fini')
    let totalBytesSaved = _xo.niceBytes(mbSaved);
    return [numPhotos, totalBytesSaved];

}