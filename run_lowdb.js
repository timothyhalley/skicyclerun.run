// 'use strict'

// LOWDB Docs & examples:
// install lowdb-node to get latest version for 2022 (3.0.2)
// use underscore to chain its function

// NODE: lowDB library
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb-node";
import _ from "underscore";
import { fileURLToPath } from "url";
import { logIt } from "./run_LogUtil.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "photoDB.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Node core & other:
const FIG = "fig";
const ERR = "err";
const BUG = "debug";

// Export modules
export {
  db_Init,
  db_Load,
  db_Size,
  db_Upsert,
  db_getFileList,
  db_getPhotos,
  db_getPhotoByName,
  db_getAlbums,
  db_photoExist,
  db_getPhoto,
  db_addNewPath,
};

async function db_Init() {
  let infoObj = {
    rundate: Date().toString(),
    author: "SkiCycleRun",
  };

  db.data ||= { info: [], photos: [] };
  await db.data.info.push(infoObj);

  await db.write();
}

async function db_Load() {
  // let infoObj = {
  //     "rundate": Date().toString(),
  //     "author": "SkiCycleRun"
  // }

  // await db.data.info.push(infoObj)
  await db.read();
}

async function db_Size(objName) {
  return db.data.photos.length;
}

async function db_getPhotos() {

  // filter 'OUT' special ALBUMS
  // * SVGPhotos
  // note: no filter = return db.data.photos;

  let dbPhotos = _.filter(db.data.photos, photos => photos.info.album != "SVGPhotos")

  return dbPhotos;
}

async function db_getPhotoByName(nameKey) {
  db._ = _.chain(db.data);

  let photoOBJ = await db._.get("photos").find({ nameID: nameKey }).value();

  // logIt(BUG, 'db_getPhotoByName: ', photoOBJ)

  return photoOBJ;
}

async function db_getPhotoByUUID(pKey) {
  db._ = _.chain(db.data);

  let pObj = await db._.get("photos").find({ uuid: pKey }).value();

  // logIt(BUG, 'db_getPhotoByUUID: ', photoOBJ)
  return pObj;
}

async function db_getPhoto(photoKey) {
  db._ = _.chain(db.data);
  let pVal = await db._.get("photos").find({ uuid: photoKey }).value();

  return pVal;
}

async function db_photoExist(UUID) {
  let photos = db.data.photos;
  let fotoExist = false;
  for (const foto of photos) {
    if (_.isMatch(foto, { uuid: UUID })) {
      fotoExist = true;
    }
  }

  return fotoExist;
}

async function db_getFileList() {
  db._ = _.chain(db.data);
  let pDB = await db._.get("photos").value();

  let files = [];
  let fno = 0;
  for (const photoObj of Object.entries(pDB)) {
    if (_.has(_.findKey(photoObj, "path"), "path")) {
      files[fno] = _.values(
        _.pick(_.find(photoObj, "path"), "path")
      ).toString();
      logIt(BUG, "db_getFileList: my file 👉 ", files[fno]);
      fno++;
    }
  }

  // logIt(BUG, "db_getFileList: ", files);
  return files;
}

async function db_getAlbums() {
  //let photos = db.get('photos')
  let albums = db.get("photos").sortBy("album").map("album").uniq().value();
  return albums;
}

async function getAlbumPhotos(albumName) {
  let photos = db
    .get("photos")
    .filter({ album: albumName, type: "JPEG" })
    .sortBy("name")
    .value();

  return photos;
}

async function getAllPhotos(keyVal, element) {
  let items = db
    .get("photos")
    //.find({key: node})
    .find({ album: keyVal })
    .value();
  return items;
}

async function getAlbumList() {
  //let photos = db.get('photos')
  let albums = db.get("photos").sortBy("album").map("album").uniq().value();
  return albums;
}

async function getDBNode(keyVal, element) {
  let dbElement = null;
  let item = db
    .get("photos")
    //.find({key: node})
    .find({ key: keyVal })
    .value();

  _.forIn(item, function (val, key) {
    if (key == element) {
      // logIt(BUG, "getDBNode:found it: ", val);
      dbElement = val;
    }
  });
  return dbElement;
}

async function db_addNewPath(pObj, areaKey, areaVal) {
  pObj.info.paths[areaKey] = areaVal;
  await db_Upsert(pObj);
}

async function db_Upsert(photoObj) {
  // let dbPhotos = await db_getPhotos();
  if ((await db_photoExist(photoObj.uuid)) && db.data.photos.length > 0) {
    let key = _.findKey(db.data.photos, { uuid: photoObj.uuid });
    db.data.photos[parseInt(key)] = photoObj;
    // await db.data.photos.push(photoObj);
  } else {
    await db.data.photos.push(photoObj);
  }
  await db.write();

}

_.mixin({
  upsert: function (collection, obj, key) {
    key = key || "uuid";
    for (var i = 0; i < collection.length; i++) {
      var el = collection[i];
      if (el[key] === obj[key]) {
        collection[i] = obj;
        logIt(BUG, "👍_.mixin:db_Upsert: ", collection[i]);
        return collection;
      }
    }
    collection.push(obj);
    logIt(BUG, "👍 _.mixin:collection:", collection)
  },
});

// ***** Helper ///

async function dumpObj(obj) {
  const iterate = (obj) => {
    Object.keys(obj).forEach((key) => {
      logIt(BUG, `key: ${key}, value: ${obj[key]}`)
      if (typeof obj[key] === "object") {
        iterate(obj[key]);
      }
    });
  };
}