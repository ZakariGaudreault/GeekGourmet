const DatabaseError = require('./databaseError.js');
const InvalidInputError = require('./invalidInputError.js');
const logger = require('../logger.js');
let collectionName = "recipe_books";
const validateUtils = require("./BookValidation.js");
let collection;
let databaseConnection;

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

      if(resetFlag){
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
 * Gets the recipe book collection
 * @returns The recipe book collection from the database
 */
async function getCollection(){
  try{
    return collection;
  }
  catch(err){
    console.log(err.message);
  }
}


/**
 * Adds a recipe book to the collection. Name must be 25 characters or less.
 * @param {*} userId username
 * @param {*} name book name
 * @returns the new recipe book if successful otherwise either null or throw an error depending of the validation
 */
async function addBook(userId, name){
  try{
    if (validateUtils.isValid2(name)){
      const book =  {userId: userId, name: name,SavedRecipes: []}
      await collection.insertOne(book)
      return await getSingleRecipeBook(userId, name);
      }
    else throw new InvalidInputError("Recipe book" + name + " is not have a valid");
    }catch(err)
    {
        let isIt = err.message.includes('not')
        if(isIt){
            throw new InvalidInputError("Recipe book " + name + " is invalid. The Name was incorrect. Please do not add anything over 25 characters");
        }

        throw new DatabaseError("Error in the database" + err);
    }
}

/**
* Gets a single recipe book
* @param {*} userId username
* @param {*} find book name
* @returns return true if the recipe was found otherwise false
*/
async function getSingleRecipeBook(userId, find) {
  try {
  let response = await collection.findOne({ userId: userId, name: find })
  return response
  }
  catch (err) {
      throw new DatabaseError("Input" + err);
  }

}

/**
* Gets every recipes book in the database
* @returns the whole collection of recipes in the database
*/
async function getAllRecipeBooks() {
  try {
      const cursor = collection.find({});
      const allValues = await cursor.toArray();
      return allValues;
  }
  catch (err) {
      throw new DatabaseError("Input" + err);
  }
}

/**
 * Gets all the recipe books of the user
 * @param {*} userId username
 * @returns An array of all the recipe books of the user
 */
async function getAllRecipeBooksOfUser(userId){
  try{
    const cursor = collection.find({userId: userId});
    const allValues = await cursor.toArray();
    return allValues;
  }
  catch(err){
    throw new DatabaseError("Input" + err);
  }
}

/**
* Deletes a recipe from the database based on the name of the recipe book
* @param {*} userId username
* @param {*} find book name
* @returns if the operation has somebody deleted or not
*/
async function deleteRecipeBook(userId, find) {
    try {
  let response = await collection.deleteOne({userId:userId, name: find })
  return response
    }
    catch (err) {
      throw new DatabaseError("Input" + err);
  }
}
/**
* Updates the book name. Validates that the new name is valid
* @param {*} userId username
* @param {*} name current book name
* @param {*} newName new book name
* @returns whether the operation was successful or not.
*/
async function updateRecipeBookName(userId, name, newName) {

  try {
      if((!validateUtils.isValid2(newName))){
          throw new InvalidInputError("Recipe " + name + " does not have a valid name");
      }
      let response = await collection.updateOne({ userId: userId, name: name }, { $set: { name: newName } })
      return response
  }
  catch (err) {
      let isIt = err.message.includes('not')
      if(isIt){
          throw new InvalidInputError("Recipe " + name + " does not have a valid name");
      }

      throw new DatabaseError("Error in the databse" + err);
  }
}

/**
 * Updates the recipe book by adding a saved recipe
 * @param {*} userId username
 * @param {*} name book name
 * @param {*} recipeId recipe id
 * @returns whether the operation was successful or not.
 */
async function updateBookAddRecipe(userId, name, recipeId){
  try{
    let book = await getSingleRecipeBook(userId, name);
    book.SavedRecipes.push(recipeId);
    let response = await collection.updateOne({ userId: userId, name: name }, { $set: { SavedRecipes: book.SavedRecipes } })
    return response
  }
  catch(err){
    if(err instanceof InvalidInputError){
      throw err;
    }
    else{
      throw new DatabaseError(err.message);
    }
  }
}

/**
 * Updates the recipe book by deleting a saved recipe
 * @param {*} userId username
 * @param {*} name book name
 * @param {*} recipeId recipe id
 * @returns whether the operation was successful or not.
 */
async function updateBookDeleteRecipe(userId, name, recipeId){
  try{
    let book = await getSingleRecipeBook(userId, name);
    let recipes = book.SavedRecipes;
    let newRecipes=[];

    for(let i = 0; i < recipes.length; i++){
      if(recipes[i] != recipeId){
        newRecipes.push(recipes[i]);
      }
    }

    let response = await collection.updateOne({ userId: userId, name: name }, { $set: { SavedRecipes: newRecipes } })
    return response
  }
  catch(err){
    if(err instanceof InvalidInputError){
      throw err;
    }
    else{
      throw new DatabaseError(err.message);
    }
  }
}

module.exports = {setCollection, getCollection,addBook,getSingleRecipeBook,getAllRecipeBooks,deleteRecipeBook,updateRecipeBookName, updateBookAddRecipe, updateBookDeleteRecipe, getAllRecipeBooksOfUser}