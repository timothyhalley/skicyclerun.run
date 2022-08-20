// // Purpose
// // Run osxPhotoExporter to select Albums to process
// // Note: Photos are exported into ./PhotoLib
// // RunBook:
// // * Move orignal files and rename based on AWS Location Services
// // * Prep picture for web use
// //    * Reduce size
// //    * Sharpen
// // * Move files to AWS S3 bucket

// // Primers and Help
// // 
// // glob --> https://github.com/isaacs/node-glob#glob-primer
// // help --> https://css-tricks.com/just-sharing-my-gulpfile/
// // AWS --> 

// import task from 'tasuku';
// import timer from 'marky';
// import fmtMS from 'pretty-ms';
// import * as _lib from './run_photolib.js';
// import * as _utl from './run_utilites.js';
// import { runScript } from './run_scripts.js';
// import { runWeb } from './run_Web.js';
// import * as _aws from './run_AWSS3.js';

// // Configuration
// const PHOTOLIB = './PhotoLib';
// const PHOTOWEB = './PhotoWeb';
// const PHOTOTMP = './PhotoTmp';
// const PHOTOFX = '/3_FXRepo';
// const AWSBUCKET = 'skicyclerun';

// // *** Helper functions
// const sleep = (ms = 1000 * Math.random() + 900) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// const someAsyncTask = (ms = 1000 * Math.random() + 900) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// const taskResults = function (tname, ttime, tdata) {

//   let results = {
//     name: tname,
//     duration: ttime,
//     data: tdata
//   }

//   return results;

// }
// //** Helper functions: end */


// // **
// // * Photo Process
// // **
// // await task('Photo Process: START', async ({ task, setTitle, setStatus }) => {

// //   timer.mark('PREP')

// //   await task('TASK #01 - Clean DB and TMP directories', async () => {
// //     await _lib.resetAll(PHOTOWEB, PHOTOTMP)
// //   });

// //   await task('TASK #02 - Get Photo META data', async () => {
// //     let photos = await _utl.getDirFiles(PHOTOLIB, 'JPEG', 'JPG'); //* --> process original photos
// //     const numPhotos = await _lib.photoData(photos)
// //   });

// //   await task('TASK #03 - Copy files to TMP directory', async () => {
// //     await _lib.photoRename(PHOTOTMP)
// //   });

// //   await task('TASK #04 - Scale Photos', async () => {
// //     await _lib.photoScale(PHOTOTMP)
// //   });

// //   const tasktime = timer.stop('PREP')
// //   setTitle('Photo Process: Finished')
// //   setStatus('Total time: ' + fmtMS(tasktime.duration))
// // })

// // await task('FX Photos: START', async ({ task, setTitle, setStatus }) => {

// //   timer.mark('FXTIME')
// //   const fxTasks = await task.group(task => [
// //     task(
// //       'TASK #05 - FX GreyScale',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'GreyScale')
// //     ),

// //     task(
// //       'TASK #06 - FX Sepia',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'Sepia')
// //     ),
// //     task(
// //       'TASK #07 - FX Poster',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'Poster')
// //     ),

// //     task(
// //       'TASK #08 - FX Pencil',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'Pencil')
// //     ),
// //     task(
// //       'TASK #09 - FX Watercolor',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'Watercolor')
// //     ),

// //     task(
// //       'TASK #10 - FX Charcoal',
// //       async () => await _lib.photoFXMaker(PHOTOTMP, 'Charcoal')
// //     )
// //   ], {
// //     concurrency: 2 // Number of tasks to run at a time
// //   })

// //   // fxTasks.clear() // Clear output
// //   // End of task group
// //   const tasktime = timer.stop('FXTIME')
// //   setTitle('Script Photos: Finished')
// //   setStatus('Total time: ' + fmtMS(tasktime.duration))
// // })

// // await task('Script Photos: START', async ({ task, setTitle, setStatus }) => {

// //   timer.mark('SCRIPT')
// //   const uxTasks = await task.group(task => [
// //     task(
// //       'SCRIPT #01 - WATERCOLOR',
// //       async () => await runScript('watercolor')
// //     ),

// //     task(
// //       'SCRIPT #02 - SKETCHING',
// //       async () => await runScript('sketching')
// //     ),
// //     task(
// //       'SCRIPT #03 - TINYPLANET',
// //       async () => await runScript('tinyplanet')
// //     )
// //   ], {
// //     concurrency: 2 // Number of tasks to run at a time
// //   })

// //   // uxTasks.clear() // Clear output

// //   // End of task group
// //   const tasktime = timer.stop('SCRIPT')
// //   setTitle('Script Photos: Finished')
// //   setStatus('Total time: ' + fmtMS(tasktime.duration))
// // })

// await task('Post Process: START', async ({ task, setTitle, setStatus }) => {

//   timer.mark('POST')


//   await task('Compress for Web', async ({ setTitle, setStatus, setOutput }) => {
//     // setTitle('title: was And another')
//     await runWeb(PHOTOTMP, PHOTOFX, PHOTOWEB)
//     setStatus('Compress Photos: Finished')
//     setOutput('Number of files: ' + '000')
//   })


//   await task('Publish', async function ({ task }) {

//     await task('Send to AWS', async ({ setTitle, setStatus, setOutput }) => {
//       // setTitle('title: was And another')
//       await _aws.upLoadAlbums(AWSBUCKET, PHOTOWEB)
//       setStatus('AWS Publish S3: finished')
//       setOutput('Number of files: ' + '000')
//     })

//   })
//   // End of task group
//   const tasktime = timer.stop('POST')
//   setTitle('Post Process: Finished')
//   setStatus('Total time: ' + fmtMS(tasktime.duration))
// })
