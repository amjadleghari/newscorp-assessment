'use strict';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongodb = new MongoMemoryServer();

/**
 * Connect to the in-memory database
 */

 module.exports.connect = async () => {
     const uri = await mongodb.getConnectionString();

     const mongooseOpts = {
         useNewUrlParser: true,
         autoReconnect: true,
         reconnectTries: Number.MAX_VALUE,
         reconnectInterval: 1000
     };

     await mongoose.connect(uri, mongooseOpts);
 }


 /**
  * Drop database, close the connection and stop mongodb.
  */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
}


/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}