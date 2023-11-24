const InvalidInputError = require('../models/invalidInputError.js');
const DatabaseError = require('../models/databaseError.js');

const recipesModel = require('../models/recipesModel.js');
const databaseConnection = require('../models/databaseConnection.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

let db = "bakery_db_test";
let mongod;

const app = require("../app.js"); 
const supertest = require("supertest");
const testRequest = supertest(app); 

jest.setTimeout(30000);

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
        .then((conn) => recipesModel.setCollection(conn, true));
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

async function getCollectionAsArray(){
    let collection = await recipesModel.getCollection();
    let items = await collection.find();
    return await items.toArray();
}

async function addOneRecipeToCollection(userId = "user1", title = "title1", type = "type", ingredients = "ingredientList", servings = "1", instructions = "instructionList"){
    let collection = await recipesModel.getCollection();
    await collection.insertOne({userId: userId, title: title, type: type, ingredients: ingredients, servings: servings, instructions: instructions})
    return ({userId: userId, title: title, type: type, ingredients: ingredients, servings: servings, instructions: instructions});
}

async function addMultipleRecipesToCollection(){
    let details = [
        {userId: "user1", title: "title1", type: "type", ingredients:"ingredientList", servings:"1", instructions: "instructionList"},
        {userId: "user1", title: "title2", type: "type", ingredients:"ingredientList", servings:"1", instructions: "instructionList"},
        {userId: "user1", title: "title3", type: "type", ingredients:"ingredientList", servings:"1", instructions: "instructionList"},
        {userId: "user4", title: "title4", type: "type", ingredients:"ingredientList", servings:"1", instructions: "instructionList"},
        {userId: "user5", title: "title5", type: "type", ingredients:"ingredientList", servings:"1", instructions: "instructionList"}
    ];

    for(let count = 0; count < details.length; count++){
        await addOneRecipeToCollection(details[count].userId, details[count].title, details[count].type, details[count].ingredients, details[count].servings, details[count].instructions)
    }
}

//==========ADD RECIPE==========
test('Success_PostRecipe: Add one recipe', async ()=> {
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type: type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(200);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(1);

    expect(recipeCol[0].userId).toBe(userId);
    expect(recipeCol[0].title).toBe(title);
    expect(recipeCol[0].ingredients).toBe(ingredients);
    expect(recipeCol[0].servings).toBe(servings);
    expect(recipeCol[0].instructions).toBe(instructions);
});

test('Failed_PostRecipe: Invalid userId', async()=>{
    let userId = "";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type: type, 
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(400);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(0);
});

test('Failed_PostRecipe: Invalid title', async()=>{
    let userId = "userTest";
    let title = "";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type : type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(400);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(0);
});

test('Failed_PostRecipe: Invalid ingredients', async()=>{
    let userId = "userTest";
    let title = "titleTest";
    let ingredients = "";
    let type = "typeTest";
    let servings = "1";
    let instructions = "instructionList";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type : type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(400);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(0);
});

test('Failed_PostRecipe: Invalid servings', async()=>{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "abc";
    let instructions = "instructionList";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type : type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(400);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(0);
});

test('Failed_PostRecipe: Invalid instructions', async()=>{
    let userId = "userTest";
    let title = "titleTest";
    let ingredients = "ingredientList";
    let type = "typeTest";
    let servings = "1";
    let instructions = "";

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type: type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(400);

    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(0);
});

test('Failed_PostRecipe: Database connection lost', async()=>{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    await databaseConnection.close();

    const testResponse = await testRequest.post('/recipe').send({
		userId: userId,
        title: title,
        type: type,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions
    });

    expect(testResponse.statusCode).toBe(500);
});



//==========GET RECIPE==========
test('Success_GetRecipe: Get one recipe', async()=>{
    let newRecipe = await addOneRecipeToCollection();
    let endPoint = '/recipe/' + newRecipe.userId + '/' + newRecipe.title;

    const testResponse = await testRequest.get(endPoint);

    expect(testResponse.status).toBe(200);
    expect(testResponse.body.userId).toBe(newRecipe.userId);
    expect(testResponse.body.title).toBe(newRecipe.title);
    expect(testResponse.body.ingredients).toBe(newRecipe.ingredients);
    expect(testResponse.body.servings).toBe(newRecipe.servings);
    expect(testResponse.body.instructions).toBe(newRecipe.instructions);
});

test('Failed_GetRecipe: Invalid userId', async()=>{
    let newRecipe = await addOneRecipeToCollection();
    let endPoint = '/recipe/' + "" + '/' + newRecipe.title;

    const testResponse = await testRequest.get(endPoint);

    expect(testResponse.status).toBe(404);
});

test('Success_GetRecipe: Get all recipe from one user', async ()=> {
    await addMultipleRecipesToCollection();
    let numRecipesOfUser1 = 3;

    const testResponse = await testRequest.get('/recipe/' + "user1");

    expect(testResponse.status).toBe(200);
    expect(Array.isArray(testResponse.body)).toBe(true);
    expect(numRecipesOfUser1).toBe(testResponse.body.length);

});

test('Success_GetRecipe: Get All recipe', async()=>{
    await addMultipleRecipesToCollection();
    let recipeCol = await getCollectionAsArray();

    const testResponse = await testRequest.get('/recipe');

    expect(testResponse.status).toBe(200);
});

//==========UPDATE RECIPE==========
test('Success_PutRecipe: Update one recipe', async ()=>{
    let newRecipe = await addOneRecipeToCollection();

    let newTitle = "newTitle";
    let newIngredients = "newIngredientList";
    let newType = "newType";
    let newServings = "2";
    let newInstructions = "newInstructionList";

    const testResponse = await testRequest.put('/recipe/' + newRecipe.userId + '/' + newRecipe.title).send({
        newTitle: newTitle,
        newType: newType,
        newIngredients: newIngredients,
        newServings: newServings,
        newInstructions: newInstructions
    });

    expect(testResponse.status).toBe(200);
    expect(testResponse.body.userId).toBe(newRecipe.userId);
    expect(testResponse.body.title).toBe(newTitle);
    expect(testResponse.body.ingredients).toBe(newIngredients);
    expect(testResponse.body.servings).toBe(newServings);
    expect(testResponse.body.instructions).toBe(newInstructions);
});

test('Success_PutRecipe: Update ingredients', async ()=>{
    let newRecipe = await addOneRecipeToCollection();

    let newTitle = null;
    let newType = null;
    let newIngredients = "newIngredientList";
    let newServings = null;
    let newInstructions = null;

    const testResponse = await testRequest.put('/recipe/' + newRecipe.userId + '/' + newRecipe.title).send({
        newTitle: newTitle,
        newType : newType,
        newIngredients: newIngredients,
        newServings: newServings,
        newInstructions: newInstructions
    });

    expect(testResponse.status).toBe(200);
    expect(testResponse.body.userId).toBe(newRecipe.userId);
    expect(testResponse.body.title).toBe(newRecipe.title);
    expect(testResponse.body.ingredients).toBe(newIngredients);
    expect(testResponse.body.servings).toBe(newRecipe.servings);
    expect(testResponse.body.instructions).toBe(newRecipe.instructions);
});

test('Failed_PutRecipe: Recipe does not exist', async ()=>{
    const testResponse = await testRequest.put('/recipe/' + 'noUser' + '/' + 'noTitle');
    
    expect(testResponse.status).toBe(400);
});

test('Failed_PutRecipe: Invalid servings', async ()=>{
    let newRecipe = await addOneRecipeToCollection();

    let newTitle = "newTitle";
    let newType = "newType";
    let newIngredients = "newIngredientList";
    let newServings = "def";
    let newInstructions = "newInstructionList";

    const testResponse = await testRequest.put('/recipe/' + newRecipe.userId + '/' + newRecipe.title).send({
        newTitle: newTitle,
        newType: newType,
        newIngredients: newIngredients,
        newServings: newServings,
        newInstructions: newInstructions
    });

    expect(testResponse.status).toBe(400);
});

//==========DELETE RECIPE==========
test('Success_DeleteRecipe: Delete one recipe', async()=>{
    let newRecipe = await addOneRecipeToCollection();

    const testResponse = await testRequest.delete('/recipe/' + newRecipe.userId + '/' + newRecipe.title);

    expect(testResponse.status).toBe(200);
    expect(testResponse.body.title).toBe(newRecipe.title);
});

test('Failed_DeleteRecipe: Invalid title', async()=>{
    let newRecipe = await addOneRecipeToCollection();

    const testResponse = await testRequest.delete('/recipe/' + newRecipe.userId + '/' + "");

    expect(testResponse.status).toBe(404);
});

