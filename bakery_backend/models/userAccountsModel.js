const DatabaseError = require("./databaseError.js");
const InvalidInputError = require("./invalidInputError.js");
const logger = require("../logger.js");
let collectionName = "user_accounts";
let collection;
let databaseConnection;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// validation imports
const validateUtilsAcc = require("./validateUtilsAccounts");
/**
 * Sets the collection in the database
 *
 * @param {object} db Database connection
 * @param {boolean} resetFlag Flag to drop collection and create a new one
 */
async function setCollection(db, resetFlag) {
  try {
    databaseConnection = db;

    logger.debug("debug");
    logger.trace("trace");

    // collation specifying case-insensitive collection
    const collation = { locale: "en", strength: 1 };

    // Check to see if the collection exists
    let collectionCursor = await db.listCollections({ name: collectionName });
    let collectionArray = await collectionCursor.toArray();
    if (collectionArray.length == 0) {
      // No match was found, so create new collection
      await db.createCollection(collectionName, { collation: collation });
    }
    collection = db.collection(collectionName); // convenient access to collection

    if (resetFlag) {
      await collection.drop();
      await db.createCollection(collectionName, { collation: collation });
      collection = db.collection(collectionName); // convenient access to collection
    }
  } catch (err) {
    logger.error(err.message);
    throw new DatabaseError(err.message);
  }
}

/**
 * Gets the user accounts collection
 * @returns The user accounts collection from the database
 */
async function getCollection() {
  try {
    return collection;
  } catch (err) {
    logger.error(err.message);
  }
}
/**
 * Close connection to database with name stored in dbName
 * Logs if closing connection was successful, otherwise logs error message
 */
async function close() {
  try {
    await client.close();
    logger.info("MongoDb connection closed");
  } catch (error) {
    logger.error(error.message);
  }
}
// =================================================================
// CRUD
// =================================================================
/**
 * Method creates an account object and adds it to the MongoDB specified collection.
 * @param {*} username of account to create.
 * @param {*} password of account to create.
 * @returns account object if successful.
 * @throws InvalidInputError if username is taken. Or if password is not good enough.
 * @throws Database error if could not add to database.
 */
async function addAccount(email, displayName, username, password) {
  try {

    // Check if an account already exists
    // ----------------------------------------------------------------
    if (await collection.findOne({ username: username })) {
      throw new DatabaseError(
        "\nAccount with username is taken. Username: " + username
      );
    }
    // check for valid username and password
    // ----------------------------------------------------------------
    else if (validateUtilsAcc.isAccountValid(email, displayName, username, password)) {
      hashedPW = await bcrypt.hash(password, saltRounds);

      // creates and returns new account object if successful
      if (await !collection.insertOne({email: email, displayName: displayName, username: username, password: hashedPW,})
      )
        throw new DatabaseError(
          `Error while inserting account into db: ${username}, ${password}`
        );

      // Return account object
      return { email: email, displayName: displayName, username: username, password: password };
    }
  } catch (err) {
    if (err instanceof InvalidInputError) {
      logger.error("Input Error while adding account: " + err.message);
    }
    else if (err instanceof DatabaseError) {
      logger.error("Database Error while adding account: " + err.message);
    } else {
      logger.error("Unexpected error while adding account: " + err.message);
    }
    throw err;
  }
}
/**
 * Queries database for a single instance of an account with the username
 * that was passed in.
 * @param {*} username to find in database.
 * @returns Account object
 * @throws DatabaseError if fails to read from database. or
 * @throws DatabaseError no account was found.
 */
async function getSingleAccount(username){
// Try reading from database
let account;
try {
    // Query database
    account = await collection.findOne({username: username});

    // If no account was found, throw
    if(account == null)
      throw new DatabaseError("Account not found");

      // If account is found, return it
    return account;
} catch (error) {
    throw new DatabaseError("Error while reading account data from database: " + error.message)
}
}
/**
 * Query all account objects inside a MongoDb collection.
 * Collection specified by accountCollection.
 * @returns array containing account objects.
 * @throws DatabaseError if query is unsuccessful.
 */
async function getAllAccounts(){
  let accountsArray;
    // Try reading from database and converting result to an array
    try {
        accountsArray = await collection.find().toArray();
       return accountsArray;

    } catch (error) {
        throw new DatabaseError("Error while reading account data from database: " + error.message);
    }
}
/**
 * Update an accounts username with the new username passed in.
 * 
 * TODO: password validation?
 * @param {*} username to be changed.
 * @param {*} newUsername to replace current.
 * @returns true if username was updated successfully, false otherwise.
 * @throws DatabaseError if new username is taken. Or if account with current username does not exist.
 * @throws InvalidInputError if newUsername does not meet requirements (Has special characters).
 */
async function updateUsername(username, newUsername) {
  try {
    // Query database for instance of account, returns null if not found
    let account = await collection.findOne({ username: username });

    // Check if the account we are updating exists
    if (account == null) {
      throw new DatabaseError(
        "\nAccount with username '" + username + "does not exist"
      );
    } 
    // Check if new username is already taken
    // ----------------------------------------
    account = await collection.findOne({ username: newUsername })

    if (account != null) {
      throw new DatabaseError(
        "\nUsername \" " + username + "\" is already taken"
      );
    }

    // validate new username 
    // ----------------------
    else if (validateUtilsAcc.isUsernameValid(newUsername)) {

      // filter to find account to update
      const filter = {username: username}

      // updates to be made on document
      const updateFilter = {$set: {username: newUsername}};

      const result = await collection.updateOne(filter, updateFilter);

      // Return result values 
      if(result.modifiedCount > 0)
        return true;

      return false;
    }
  } catch (err) {
    if (err instanceof InvalidInputError) {
      logger.error("Input Error while updating account username: " + err.message);
    }
    else if (err instanceof DatabaseError) {
      logger.error("Database Error while updating account username: " + err.message);
    } else {
      logger.error("Unexpected error while updating account username: " + err.message);
    }
    throw err;
  }
}

/**
 * Update an account document inside a mongoDB with a new password.
 * Validates if the password is strong and if it is not the same as the old password.
 * @param {*} username of the account to update.
 * @param {*} password of the current account.
 * @param {*} newPassword to replace the current password.
 * @returns True if account password was updated, false otherwise.
 * @throws Database error if account with username does not exist.
 * @throws InvalidInputError if the newPassword does not meet requirments.
 */
async function updatePassword(username, password, newPassword){

  try {

      // Query database for instance of account, returns null if not found
    let account = await collection.findOne({ username: username });

    // Check if the account we are updating exists
    if (account == null) {
      throw new DatabaseError(
        "\nAccount with username '" + username + "does not exist"
      );
    } 
    // validate new password is infact new 
    if (password == newPassword){
      throw new InvalidInputError("New password cannot be old password.");
    }
    // Validate that the current password passed in is correct
    if(await bcrypt.compare(password, account.password)){
      throw new InvalidInputError("Current password is incorrect.");
    }
    // validate newPassword 
    if(validateUtilsAcc.isPasswordValid(newPassword)){
       // filter to find account to update
       const filter = {username: username}

       // updates to be made on document
       const updateFilter = {$set: {password: newPassword}};
 
       const result = await collection.updateOne(filter, updateFilter);

       // Return true if the account was updated successfully
      if(result.modifiedCount > 0)
        return true;
    }

    // Return false by default
    return false;

  } catch (err) {
    if (err instanceof InvalidInputError) {
      logger.error("Input Error while updating password: " + err.message);
    }
    else if (err instanceof DatabaseError) {
      logger.error("Database Error while updating account password: " + err.message);
    } else {
      logger.error("Unexpected error while updating account password: " + err.message);
    }
    throw err;
    
  }

}
/**
 * Update an accounts display name with the new name passed in.
 * Only require username to query for the account since they are unique.
 * @param {*} username of the account to update. 
 * @param {*} newDisplayName to replace current.
 * @returns true if display name was updated successfully, false otherwise.
 * @throws InvalidInputError if new display does not meet requirements (Has special characters)
 */
async function updateDisplayName(username, newDisplayName) {
  try {
    // Query database for instance of account, returns null if not found
    let account = await collection.findOne({ username: username });

    // Check if the account we are updating exists
    if (account == null) {
      throw new DatabaseError(
        "\nAccount with username '" + username + "' does not exist"
      );
    } 

    // validate new username 
    // ----------------------
    else if (validateUtilsAcc.isDisplayNameValid(newDisplayName)) {

      // filter to find account to update
      const filter = {username: username}

      // updates to be made on document
      const updateFilter = {$set: {displayName: newDisplayName}};

      const result = await collection.updateOne(filter, updateFilter);

      // Return result values 
      if(result.modifiedCount > 0)
        return true;

      return false;
    }
  } catch (err) {
    if (err instanceof InvalidInputError) {
      logger.error("Input Error while updating account display name: " + err.message);
    }
    else if (err instanceof DatabaseError) {
      logger.error("Database Error while updating account display name: " + err.message);
    } else {
      logger.error("Unexpected error while updating account display name: " + err.message);
    }
    throw err;
  }

}

/**
 * Find document inside of a mongodb database with matching username and password.
 * Username and password are validated before querying the database.
 * If document is found, it will be deleted.
 * @param {*} username of account to query for.
 * @param {*} password of account to query for.
 * @returns account object if delete was successful
 * @throws InvalidInputError if username or password are invalid.
 * @throws DataBaseError if account could not be deleted.
 */
async function removeAccount(username, password){
  try {
      
      // search only if input passed in is valid -- automatically throws
      if(validateUtilsAcc.isUsernameValid(username) && validateUtilsAcc.isPasswordValid(password)){
  

    
        // filter for query
        let filter = {username: username, password: password};
        // Query if account exists
        let result = await collection.deleteOne(filter,true); // true = delete just one
        logger.trace("Result from delete query: " + result);

        // if accountToDelete is null, then account was not found
        if(result.deletedCount === 0)
            throw new DatabaseError("Account to delete does not exist");
        
        if(result.deletedCount === 1){
            return filter;
        }
        else throw new DatabaseError("Unexpected error while deleting account");;
      }
    // Error handling
} catch (err) {
    if(err instanceof InvalidInputError)
        logger.info("Database inside of deleteOne " + err.message);
    if(err instanceof DatabaseError)
      logger.info("Database inside of deleteOne " + err.message);
    else 
      logger.info("Unexpected error inside of deleteOne " + err.message);

    throw err;
    
}
}
module.exports = {
    setCollection,
    getCollection,
    addAccount,
    getSingleAccount,
    getAllAccounts,
    updateUsername, 
    updateDisplayName,
    updatePassword,
    removeAccount,
    close };
