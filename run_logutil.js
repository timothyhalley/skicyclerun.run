// Log Utility
// Run osxPhotoExporter to select Albums to process
// Note: Photos are exported into ./PhotoLib
// run_logutil.js:

// Primers and Help
// chalk --> https://www.npmjs.com/package/chalk
export { logit };

import chalk from 'chalk';
import fig from 'figlet';
import boxen from 'boxen';
import ora from 'ora';

const sendLog = console.log;

const normal = chalk.bgBlue;
const warning = chalk.bold.yellowBright;
const debug = chalk.bold.bgRedBright;
const error = chalk.bold.red;

const spinner = ora({
    discardStdin: false,
    text: 'default settings',
    spinner: 'moon',
});

function slOut(cmd, info) {

    switch (cmd) {
        case 'start':
            spinner.text = info;
            spinner.start();
            break;

        case 'info':
            spinner.text = info;
            break;

        case 'stop':
            spinner.stop();
            break;

        case 'noOpt':
        default:
            break;
    }

}

function logit(type, ...args) {

    let sllCMD = null;
    if (type == 'sllog') {
        sllCMD = args.shift();
    }
    let logStr = '';
    if (args.length > 0) {
        args.forEach(arg => {
            logStr = logStr + arg + ' ';
        })
        logStr = logStr.trim();
    }

    switch (type) {
        case 'box':
            sendLog(boxen(logStr, { padding: 1 }));
            break;

        case 'log':
            sendLog(normal(logStr))
            break;

        case 'warn':
            sendLog(warning(logStr))
            break;

        case 'debug':
            if (process.env.DEBUG_LOG) {
                sendLog(debug(logStr))
            }
            break;

        case 'err':
            sendLog(error(logStr));
            if (process.env.DEBUG_LOG == true) process.abort()
            break;

        case 'fig':
            sendLog(fig.textSync(logStr, {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 120,
                whitespaceBreak: true
            }));
            break;

        case 'sllog':
            // grab first ARG as ORA cmd
            slOut(sllCMD, logStr)
            break;

        case 'noargs':
        default:
            sendLog(type);
            break;
    }

}