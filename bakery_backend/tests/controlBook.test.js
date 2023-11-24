const InvalidInputError = require('../models/invalidInputError.js');
const DatabaseError = require('../models/databaseError.js');

const recipesBookModel = require('../models/recipeBooksModel.js');
const databaseConnection = require('../models/databaseConnection.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

let db = "book_db_test";
let mongod;

const app = require("../app.js"); 
const supertest = require("supertest");
const testRequest = supertest(app); 



beforeAll(async () => {
    // This will create a new instance of "MongoMemoryServer" and automatically start it
    try {
    mongod = await MongoMemoryServer.create();
    console.log("Mock Database started");
    } catch (err) {
        console.log(err.message);
    }
});


afterAll(async () => {  
    // Stop the MongoMemoryServer
    await mongod.stop();
    console.log("Mock Database stopped");
});

beforeEach(async () => {
    try {
        const url = mongod.getUri();
        await databaseConnection.connectToDatabase(url, db)
        .then((conn) => recipesBookModel.setCollection(conn, true));
    } 
    catch (err) {
        console.log(err.message);
    }
});

//afterEach is being called out of sequence. Something wrong with model.close()?
//For example, once client.connect() is executed in connectToDatabase(), it jumps immediately to afterEach().
//The rest of connectToDatabase() aren't being executed.
//Therefore, it's not establishing a connection to the database and some of the tests fail.
afterEach(async () => {
    //await recipesModel.close();
});
var userData = [
    { userId: "user1", name: 'Book1', SavedRecipes: null},
    { userId: "user2", name: 'Book2', SavedRecipes: null},
    { userId: "user3", name: 'Book3', SavedRecipes: null},
    { userId: "user4", name: 'Book4', SavedRecipes: null},
    { userId: "user5", name: 'Book5', SavedRecipes: null},
    { userId: "user6", name: 'Book6', SavedRecipes: null},
]

async function getCollectionAsArray(){
    let collection = await recipesBookModel.getCollection();
    let items = await collection.find();
    return await items.toArray();
}

async function addOneRecipeToCollection(userId = "user1", name = "Book", content = null){
    let collection = await recipesBookModel.getCollection();
    await collection.insertOne({userId: userId, name: name, content: content})
    return ({userId: userId, name: name, content: content});
}


//==========ADD RECIPE==========
test('Success_PostRecipe: Add one recipe', async ()=> {
    let username = "userTest"
    let name = "bookTest";
    let SavedRecipes = "SavedRecipes";
    
    const testResponse = await testRequest.post('/book').send({
        userId: username,
		name: name,
        SavedRecipes: SavedRecipes,
    });

    expect(testResponse.statusCode).toBe(200);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(1);

    expect(recipeCol[0].userId).toBe(username);    
    expect(recipeCol[0].name).toBe(name);
    expect(recipeCol[0].SavedRecipes).toBe(SavedRecipes);
  
});

//==========Delete RECIPE==========
test('Success_PostRecipe: Add one recipe', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    let name = "Book";
  

    const testResponse = await testRequest.delete('/book').send({
		userId: newRecipeBook.userId,
        name: newRecipeBook.name,
    });

    expect(testResponse.statusCode).toBe(200);

    let recipeCol = await getCollectionAsArray();

    expect(recipeCol.length).toBe(0);  
});
//==========Find RECIPE==========
test('Success_PostRecipe: Add one recipe', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    let name = "Book";
  

    const testResponse = await testRequest.get('/book').send({
		userId: newRecipeBook.userId,
        name: newRecipeBook.name,
    });

    expect(testResponse.statusCode).toBe(200);

});


