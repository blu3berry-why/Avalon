// MongoDB imports
const db = require('mongodb');
const Client = db.MongoClient;

//environment variables
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

// the url to the database
const url = process.env.MONGODB_URL;

//TODO simplify parameters as a class
/*
class DbData{
    DbData(databaseName, collectionName, query, etc...)
}
*/

/**
 * Creates a database, it's not visible until it has content!
 * @param {String} databaseName The name of the database
 */
module.exports.createDB = function (databaseName) {
  Client.connect(url + databaseName, function (err, db) {
    if (err) throw err;
    console.log('Database cerated');
    db.close();
  });
};

/**
 * Inserts a collection to the database
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 */
module.exports.createCollection = function (databaseName, collectionName) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo.createCollection(collectionName, function (err, res) {
      if (err) throw err;
      console.log('Collection created');
      db.close();
    });
  });
};

/**
 *  Inserts a document into the given collection
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} document The document to insert
 */
module.exports.insertDocument = function (
  databaseName,
  collectionName,
  document
) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo.collection(collectionName).insertOne(document, function (err, res) {
      if (err) throw err;
      console.log('1 document inserted');
      db.close();
    });
  });
};

/**
 *  Inserts a list of documents into the given collection
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {List of Objects} documents The list of document to insert
 */
module.exports.insertManyDocuments = function (
  databaseName,
  collectionName,
  documents
) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);

    dbo.collection(collectionName).insertMany(documents, function (err, res) {
      if (err) throw err;
      console.log(res.insertedCount + 'documents inserted');
      db.close();
    });
  });
};

/**
 * Finds a document (the first if there are many) and returns a promise with the data
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data
 * @returns A promise with the data
 */
module.exports.findDocument = function (databaseName, collectionName, query) {
  return new Promise((resolve, reject) => {
    Client.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db(databaseName);
      let queryResult;
      dbo.collection(collectionName).findOne(query, function (err, res) {
        if (err) reject(err);
        resolve(res);
        db.close();
      });
    });
  });
};

/**
 * Finds all the documents and returns them as a promise
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data you can give it regular expressions as {name: /regular expression/}
 * @returns A promise with the data
 */
module.exports.findManyDocuments = function (
  databaseName,
  collectionName,
  query
) {
  return new Promise((resolve, reject) => {
    Client.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db(databaseName);
      dbo
        .collection(collectionName)
        .find(query)
        .toArray(function (err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
    });
  });
};

/**
 * Returns the data sorted
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data you can give it regular expressions as {name: /regular expression/}
 * @param {Object} sortby The way you want to sort it example {name : 1} 1 ia ascending -1 is descending
 * @returns A promise with the data
 */
module.exports.sortDocuments = function (
  databaseName,
  collectionName,
  query,
  sortby
) {
  return new Promise((resolve, reject) => {
    Client.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db(databaseName);
      //sorting by name in ascending order descrndong order would be -1

      dbo
        .collection(collectionName)
        .find(query)
        .sort(sortby)
        .toArray(function (err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
    });
  });
};

/**
 * Deletes the first document matching the query
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data
 */
module.exports.deleteDocument = function (databaseName, collectionName, query) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo.collection(collectionName).deleteOne(query, function (err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
};

/**
 * Deletes all documents matching the query
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data
 */
module.exports.deleteManyDocuments = function (
  databaseName,
  collectionName,
  query
) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo.collection(collectionName).deleteMany(query, function (err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
  });
};

/**
 * Deletes a collection
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 */
module.exports.dropCollection = function (databaseName, collectionName) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo.dropCollection(collectionName, function (err, delOK) {
      if (err) throw err;
      if (delOK) console.log('Collection deleted');
      db.close();
    });
  });
};

/**
 * Updates a document with $set we can update only the required fields
 * example newValues = {$set: {name : 'Brian', adress: 'Oak street 54'}}
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data
 * @param {Object} newValues The new values
 */
module.exports.updateDocument = function (
  databaseName,
  collectionName,
  query,
  newValues
) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    // with $set we can update only the required fields
    dbo
      .collection(collectionName)
      .updateOne(query, newValues, function (err, res) {
        if (err) throw err;
        console.log('1 document updated');
        db.close();
      });
  });
};

/**
 * Updates all documents which match the query with $set we can update only the required fields
 * example newValues = {$set: {name : 'Brian', adress: 'Oak street 54'}}
 * @param {String} databaseName The name of the database
 * @param {String} collectionName The collection's name
 * @param {Object} query An object with the query data
 * @param {Object} newValues The new values
 */
module.exports.updateManyDocuments = function (
  databaseName,
  collectionName,
  query,
  newValues
) {
  Client.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(databaseName);
    dbo
      .collection(collectionName)
      .updateMany(query, newValues, function (err, res) {
        if (err) throw err;
        console.log(res);
        db.close();
      });
  });
};
