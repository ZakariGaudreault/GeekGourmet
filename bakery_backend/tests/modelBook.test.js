const InvalidInputError = require('../models/invalidInputError.js');
const DatabaseError = require('../models/databaseError.js');

const recipesBookModel = require('../models/recipeBooksModel.js');
const databaseConnection = require('../models/databaseConnection.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

let db = "book_db_test";
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
test('Successfully adding one recipe book', async()=>{
    let userId = "user1"
    let bookName = "MyFirstBook";
    let content = null;

    await recipesBookModel.addBook(userId, bookName, content);
    let recipeCol = await getCollectionAsArray();


    expect(recipeCol.length).toBe(1);


});

test('Unsuccessfully not adding one recipe book due to the name being to long', async()=>{
    try{
    let userId = "user1";
    let bookName = "MyFirstBookkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk";
    let content = null;
    await recipesBookModel.addBook(userId, bookName, content);
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
    }
    catch(e)
{
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
}
});
test('Unsuccessfully not adding one recipe book due to the name being only white spaces', async()=>{
    try{
    let userId = "user1";
    let bookName = "    ";
    let content = null;
    await recipesBookModel.addBook(userId, bookName, content);
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
    }
    catch(e)
{
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
}
});


test('Unsuccessfully not adding one recipe book due to the name being only white spaces', async()=>{
    try{
    let userId = "user1";
    let bookName = "    ";
    let content = null;
    await recipesBookModel.addBook(userId, bookName, content);
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
    }
    catch(e)
{
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
}
});

//==========DELETE RECIPE==========
test('Successfully deleteRecipe: Delete one recipe', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    await recipesBookModel.deleteRecipeBook(newRecipeBook.userId, newRecipeBook.name);
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(0);
});

test('Unsuccessfully deleteRecipe because the recipe is not found', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    await recipesBookModel.deleteRecipeBook(newRecipeBook.userId, "");
    let recipeCol = await getCollectionAsArray();
    expect(recipeCol.length).toBe(1);
});
//==========FIND RECIPE==========
test('Successfully find one book', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    let succesfulSearch = await recipesBookModel.getSingleRecipeBook(newRecipeBook.userId, newRecipeBook.name);
   

    expect(succesfulSearch).not.toBe(null);
   
});
test('Unsuccessfully find one book', async ()=> {
    await addOneRecipeToCollection();
    let succesfulSearch = await recipesBookModel.getSingleRecipeBook("user1", "");
    expect(succesfulSearch).toBe(null);
   
});
test('Successfuly find all books', async ()=> {
    for (let i = 0; i < 5; i++) {
        await addOneRecipeToCollection();
    }
    let everything = await recipesBookModel.getAllRecipeBooks();
    expect(everything.length).toEqual(5);
});
//==========UPDATE RECIPE==========
test('Successfuly update book name', async ()=> {
    let newRecipeBook = await addOneRecipeToCollection();
    let succesfulSearch = await recipesBookModel.updateRecipeBookName(newRecipeBook.userId, newRecipeBook.name,"ThisNewName");

    expect(succesfulSearch.modifiedCount).toBe(1);
});

test('Unsuccessfuly update book name; name not found', async ()=> {
    let changed = 0
    try{
    await addOneRecipeToCollection();
    let succesfulSearch = await recipesBookModel.updateRecipeBookName("","ThisNewName");

    expect(succesfulSearch.modifiedCount).toBe(0);
    changed++;
    }catch(err){
        expect(changed).toBe(0);
    }
});

test('Unsuccessfuly update book name; name too long', async ()=> {
  
    try{
    let newRecipeBook = await addOneRecipeToCollection();
    let succesfulSearch = await recipesBookModel.updateRecipeBookName(newRecipeBook.name,"ThisNewNameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");  
    expect(succesfulSearch.modifiedCount).toBe(0);
    }
    catch(err){
        let recipeCol = await getCollectionAsArray();
        expect(recipeCol[0].name).toBe("Book");
    }

   
});
