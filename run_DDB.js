import * as _ddb from "./lib_AWSDB.js";
import { logIt } from "./run_LogUtil.js";

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
    console.log(tableInfo);
}

async function loadData(tableName) {
    const result = await _ddb.loadData2(tableName)
    console.log(result)
}

// ********** Run sequence tasks
(async function () {
    // Tasks START
    logIt(FIG, "DB DYNAMO");

    // await loadData("WHATEVER")

    // await createTable("photo2")

    const arrTables = await listTables();

    for (let table in arrTables) {
        logIt(BOX, "Table Name:", arrTables[table])
        await describeTable(arrTables[table]);

    }

    await loadData("photo2")

    logIt(FIG, "DYNAMO DB");
    // AWS Fini
})();