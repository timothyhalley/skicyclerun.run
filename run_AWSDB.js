// Node JS
import { readFile } from "node:fs/promises";

// Project primatives
import { logIt } from "./run_LogUtil.js";
import * as _xo from "./run_Utilities.js";

// AWS SDK
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient, CreateTableCommand, ListTablesCommand, DescribeTableCommand, PutItemCommand
} from "@aws-sdk/client-dynamodb";
const dynamodb = new DynamoDBClient({ region: 'us-west-2' });


// Module Constants
const ERR = "err";
const BOX = "box";
const LOG = "log";
const FIG = "fig";
const BUG = "debug";
const SLL = "sllog";

export { listTables, describeTable, createTable, destroyTable, loadData };

// Module CONST
async function listTables() {
  const command = new ListTablesCommand({});
  try {
    const data = await dynamodb.send(command);
    const tableNames = data.TableNames;
    console.log('Table names:', tableNames);
    return tableNames;
  } catch (err) {
    logIt(ERR, "run_AWSDB:listTables: ", err);
    return "FAILED"
  }
}

async function describeTable(tableName) {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    const response = await dynamodb.send(command);

    // Extract attribute definitions
    const attributeDefinitions = response.Table.AttributeDefinitions;
    console.log('Attribute Definitions:');
    attributeDefinitions.forEach((attr) => {
      console.log(`- Name: ${attr.AttributeName}, Type: ${attr.AttributeType}`);
    });

    // Print other relevant table information (e.g., key schema, provisioned throughput, etc.)
    console.log('Key Schema:');
    response.Table.KeySchema.forEach((key) => {
      console.log(`- AttributeName: ${key.AttributeName}, KeyType: ${key.KeyType}`);
    });

    console.log('Provisioned Throughput:');
    console.log(`- Read Capacity Units: ${response.Table.ProvisionedThroughput.ReadCapacityUnits}`);
    console.log(`- Write Capacity Units: ${response.Table.ProvisionedThroughput.WriteCapacityUnits}`);

    return response;

  } catch (err) {
    logIt(ERR, "run_AWSDB:describeTable: ", err);
  }

}

async function createTable(tableName) {
  const params = {
    TableName: tableName, // Replace with your desired table name
    KeySchema: [
      { AttributeName: 'uuid', KeyType: 'HASH' }, // Partition key
      { AttributeName: 'photoName', KeyType: 'RANGE' },// Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'uuid', AttributeType: 'S' }, // String type for 'uuid'
      { AttributeName: 'photoName', AttributeType: 'S' }, // String type for 'photoName'
      // Add more attributes as needed
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5, // Adjust as needed
      WriteCapacityUnits: 5, // Adjust as needed
    },
  };

  const command = new CreateTableCommand(params);

  try {
    const data = await dynamodb.send(command);
    console.log('Table created successfully:', data);
    return data
  } catch (err) {
    logIt(ERR, "run_AWSDB:createSchema", err);
    return "FAILED"
  }
}

async function destroyTable() {
  try {

  } catch (err) {

    logIt(ERR, "run_AWSDB:destroyTable", err);
    return null;
  }
}

async function loadData(tableName) {
  try {
    // Load data from the JSON file
    const jsonData = await readFile('photoDB.json', 'utf8');
    const data = JSON.parse(jsonData);

    // little helper function ---
    async function insertItem(item) {
      const marshalledItem = marshall(item);

      const params = {
        TableName: tableName,
        Item: marshalledItem,
      };

      try {
        await dynamodb.send(new PutItemCommand(params));
        console.log("Item inserted successfully:", marshalledItem);
      } catch (error) {
        console.error("Error inserting item:", error.message);
      }
    }
    // --------------------------

    // Insert each item into the table
    if (Array.isArray(data)) {
      data.forEach(insertItem);
    } else {
      insertItem(data);
    }

  } catch (err) {

    logIt(ERR, "run_AWSDB:loadData", err);
    return null;
  }
}
// --------------------------------------------------------------------------
// AWS Docs
// -- https://www.npmjs.com/package/@aws-sdk/client-s3
// -- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
// -- https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html
// AWS SDK for JavaScript V3 API Reference Guide
// -- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
// JavaScript Developer Blog
// -- https://aws.amazon.com/blogs/developer/category/programing-language/javascript/
// AWS JavaScript Forum
// -- https://forums.aws.amazon.com/forum.jspa?forumID=148
// JavaScript examples in the AWS Code Catalog
// -- https://docs.aws.amazon.com/code-samples/latest/catalog/code-catalog-javascriptv3.html
// AWS Code Example Repository
// -- https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascriptv3/example_code
// Gitter channel
// -- https://gitter.im/aws/aws-sdk-js

// API --> https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
// PutObjectRequest input: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#body
