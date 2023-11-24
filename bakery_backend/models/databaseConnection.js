const {MongoClient} = require("mongodb");
const DatabaseError = require('./databaseError.js');
const logger = require('../logger.js');
let client;

/**
 * Connect up to the online MongoDb database based on .env details
 */
async function connectToDatabase(url, dbName){
    try{
        logger.debug("debug");
        logger.trace("trace");
  
        client = new MongoClient(url); // store connected client for use while the app is running
        await client.connect(); 
        logger.info("Connected to Mongo");
        let db = client.db(dbName);

        return db;
    }
    catch(err){
        logger.error(err.message);
        throw new DatabaseError(err.message);
    }
}

/**
 * Closes the database connection
 */
async function close(){
    try{
      await client.close();
      console.log("MongoDb connection closed");
    }
    catch (err) {
      console.log(err.message);
    }
  
}

module.exports = {connectToDatabase, close}