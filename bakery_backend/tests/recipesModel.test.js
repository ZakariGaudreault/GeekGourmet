const InvalidInputError = require('../models/invalidInputError.js');
const DatabaseError = require('../models/databaseError.js');

const recipesModel = require('../models/recipesModel.js');
const databaseConnection = require('../models/databaseConnection.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

let db = "bakery_db_test";
let mongod;

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
test('Success_AddNewRecipe: Add one recipe', async()=>{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    let recipeCol = await getCollectionAsArray();

    expect(Array.isArray(recipeCol)).toBe(true);
    expect(recipeCol.length).toBe(1);

    expect(recipeCol[0].userId).toBe(userId);
    expect(recipeCol[0].title).toBe(title);
    expect(recipeCol[0].ingredients).toBe(ingredients);
    expect(recipeCol[0].servings).toBe(servings);
    expect(recipeCol[0].instructions).toBe(instructions);
    expect(recipeCol[0].type).toBe(type);
});

test('Failed_AddNewRecipe: Invalid userId', async ()=>{
    try{
    let userId = "";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_AddNewRecipe: Invalid title', async ()=>{
    try{
    let userId = "userTest";
    let title = "";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "instructionList";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_AddNewRecipe: Invalid ingredients', async ()=>{
    try{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "";
    let servings = "1";
    let instructions = "instructionList";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_AddNewRecipe: Invalid servings', async ()=>{
    try{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "abc";
    let instructions = "instructionList";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_AddNewRecipe: Invalid instructions', async ()=>{
    try{
    let userId = "userTest";
    let title = "titleTest";
    let type = "typeTest";
    let ingredients = "ingredientList";
    let servings = "1";
    let instructions = "";

    await recipesModel.addNewRecipe(userId, title, ingredients,servings, instructions, type);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

//==========READ RECIPE==========
test('Success_GetOneRecipe: Get one recipe', async () =>{
    let newRecipe = await addOneRecipeToCollection();
    let recipeCol = await getCollectionAsArray();

    let rec = await recipesModel.getOneRecipe(newRecipe.userId, newRecipe.title);

    expect(recipeCol[0].userId).toBe(rec.userId);
    expect(recipeCol[0].title).toBe(rec.title);
    expect(recipeCol[0].ingredients).toBe(rec.ingredients);
    expect(recipeCol[0].servings).toBe(rec.servings);
    expect(recipeCol[0].instructions).toBe(rec.instructions);
});

test('Failed_GetOneRecipe: Invalid userId', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();
        let rec = await recipesModel.getOneRecipe("", newRecipe.title);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_GetOneRecipe: Invalid title', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();
        let rec = await recipesModel.getOneRecipe(newRecipe.userId, "");
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Success_GetRecipesOfOneUser: Get all recipes of one user', async ()=>{
    await addMultipleRecipesToCollection();
    let numRecipesOfUser1 = 3;

    let allRec = await recipesModel.getRecipesOfOneUser("user1");

    expect(Array.isArray(allRec)).toBe(true);
    expect(numRecipesOfUser1).toBe(allRec.length);

});

test('Failed_GetRecipesOfOneUser: Empty username', async ()=>{

    try{
        let allRec = await recipesModel.getRecipesOfOneUser("");
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Success_GetRecipes: Get all recipes', async () => {
    await addMultipleRecipesToCollection();
    let modelCol = await recipesModel.getRecipes();
    let collection = await getCollectionAsArray();

    expect(Array.isArray(modelCol)).toBe(true);
    expect(modelCol.length).toBe(collection.length);
});

//==========UPDATE RECIPE==========
test('Success_UpdateRecipe: Update one recipe', async () => {
    let newRecipe = await addOneRecipeToCollection();

    let newTitle = "newTitle";
    let newType = "newType";
    let newIngredients = "newIngredientList";
    let newServings = "2";
    let newInstructions = "newInstructionList";

    let result = await recipesModel.updateRecipe(newRecipe.userId, newRecipe.title, newTitle, newType, newIngredients, newServings, newInstructions);

    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(1);

    expect(result.updateResult.modifiedCount).toBe(1);
    expect(recipeCol[0].userId).toBe(newRecipe.userId);
    expect(recipeCol[0].title).toBe(newTitle);
    expect(recipeCol[0].ingredients).toBe(newIngredients);
    expect(recipeCol[0].servings).toBe(newServings);
    expect(recipeCol[0].instructions).toBe(newInstructions);
});

test('Success_UpdateRecipe: Update title only', async ()=>{
    let recipe = await addOneRecipeToCollection();
    let newTitle = "newTitle";

    let result = await recipesModel.updateRecipe(recipe.userId, recipe.title, newTitle);

    let recipeCol = await getCollectionAsArray();

    expect(recipeCol.length).toBe(1);
    expect(result.updateResult.modifiedCount).toBe(1);
    expect(recipeCol[0].title).toBe(newTitle);
    expect(recipeCol[0].ingredients).toBe(recipe.ingredients);

});

test('Failed_UpdateRecipe: Recipe does not exist', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();

        let newTitle = "newTitle";
        let newType = "newType";
        let newIngredients = "newIngredientList";
        let newServings = "def";
        let newInstructions = "instructions";
    
        await recipesModel.updateRecipe("user", "title", newTitle, newType, newIngredients, newServings, newInstructions);   
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_UpdateRecipe: Invalid servings', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();

        let newTitle = "newTitle";
        let newIngredients = "newIngredientList";
        let newType = "newType";
        let newServings = "def";
        let newInstructions = "instructions";
    
        await recipesModel.updateRecipe(newRecipe.userId, newRecipe.title, newTitle, newType, newIngredients, newServings, newInstructions);   
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

//==========DELETE RECIPE==========
test('Success_DeleteRecipe: Delete one recipe', async ()=> {
    let newRecipe = await addOneRecipeToCollection();

    let result = await recipesModel.deleteRecipe(newRecipe.userId, newRecipe.title);

    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
    expect(result.recipe.title).toBe(newRecipe.title);
});

test('Failed_DeleteRecipe: Delete non existent recipe', async ()=> {

    try{
        let result = await recipesModel.deleteRecipe("testUser", "testTitle");
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_DeleteRecipe: Invalid userId', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();
        let rec = await recipesModel.deleteRecipe("", newRecipe.title);
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});

test('Failed_DeleteRecipe: Invalid title', async ()=>{
    try{
        let newRecipe = await addOneRecipeToCollection();
        let rec = await recipesModel.deleteRecipe(newRecipe.userId, "");
    }
    catch(e){
        expect(e instanceof InvalidInputError).toBe(true);
    }
});  

test('Failed : Connection Lost', async ()=> {
    try{
        let newRecipe = await addOneRecipeToCollection();
        await databaseConnection.close();
        let rec = await recipesModel.deleteRecipe(newRecipe.userId, newRecipe.title);
    }
    catch(e){
        expect(e instanceof DatabaseError).toBe(true);
    }
});
