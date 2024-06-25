import * as _ddb from "./lib_AWSDB.js";
import { logIt } from "./lib_LogUtil.js";

const PHOTOTABLE = "photoNew"

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";

async function listTables() {
    return await _ddb.listTables();
}

async function describeTable(tableName) {
    const tableItemCnt = await _ddb.describeTable(tableName);
    console.log(`\nNumber of items in table: ${tableName}: `, tableItemCnt);
}

async function createTable(tableName) {
    const tableInfo = await _ddb.createTable(tableName);
    logIt(BOX, tableInfo);
}

async function loadData(tableName) {
    const result = await _ddb.loadData(tableName)
    logIt(BOX, result);
}

// ********** Run sequence tasks
(async function () {
    // Tasks START
    logIt(FIG, "DB DYNAMO");

    let tableExists = false
    const arrTables = await listTables();

    for (let table in arrTables) {
        logIt(BOX, "Table Name:", arrTables[table])
        await describeTable(arrTables[table]);
        if (arrTables[table] === PHOTOTABLE) {
            tableExists = true
        }
    }

    if (!tableExists) {
        await createTable(PHOTOTABLE)
    }

    await loadData(PHOTOTABLE)

    logIt(FIG, "DYNAMO DB");
    // AWS Fini
})();