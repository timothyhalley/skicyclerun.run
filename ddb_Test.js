import * as _ddb from "./run_AWSDB.js";
import { logIt } from "./run_LogUtil.js";

const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";

async function listTables() {
    const tables = await _ddb.listTables();
    console.log(tables);

    return tables
}

async function describeTable(tableName) {
    const tableInfo = await _ddb.describeTable(tableName);
    console.log(tableInfo);
}

async function createTable(tableName) {
    const tableInfo = await _ddb.createTable(tableName);
    console.log(tableInfo);
}

async function loadData(tableName) {
    const result = await _ddb.loadData(tableName)
    console.log(result)
}

// ********** Run sequence tasks
(async function () {
    // Tasks START
    logIt(FIG, "DB DYNAMO");

    // await loadData("WHATEVER")

    await createTable("genAI_Test")
    // const arrTables = await listTables();

    // for (let table in arrTables) {

    //     await describeTable(arrTables[table]);
    // }

    logIt(FIG, "DYNAMO DB");
    // AWS Fini
})();