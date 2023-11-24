const InvalidInputError = require('../models/invalidInputError');
const DatabaseError= require('../models/databaseError');
const {faker} = require('@faker-js/faker');
const logger = require("../logger.js");

const model = require('../models/userAccountsModel');
const utils = require('../models/validateUtilsAccounts');
const databaseConnection = require('../models/databaseConnection');
const { MongoMemoryServer} = require('mongodb-memory-server');

require("dotenv").config();
jest.setTimeout(100000);
let db = "user_account_test"; // collection name

// format: email, displayName, username, password
const userData = [
    {email:faker.internet.email(), displayName: "RandomUsername1", username: "username1" , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "darkLordSon", username: "username2"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "DarkerLordSon", username: "username3"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "sundayDaisy", username: "username4"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "anotherDisplay", username: "username5"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "helloDarkness123", username: "username6"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "IloveWebProgramming", username: "username7"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "ThePersonAboveMeLied", username: "username8"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "gosunohairline", username: "username9"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "GodSlayer256", username: "username10"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "HotDawg514", username: "username11"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "CyberSlasher", username: "username12"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "epicdestroyer", username: "username13"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "irandoutofideas", username: "username14"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "bombobararocelclat", username: "username15"  , password: "testPassword123!"},
    {email:faker.internet.email(), displayName: "HisHighnessMishMish", username: "username16"  , password: "testPassword123!"},
]

/** Since a  account can only be added to the DB once, we have to splice from the array. */
const generateAccountData_Old = () => userData.splice(Math.floor((Math.random() * userData.length)), 1)[0];

// Updated version of generating account data using faker.js 
// Default password isntead of faker js because reg expression suck
function generateAccountData(){
    return  {email:faker.internet.email(), displayName: faker.name.middleName(), username: faker.name.firstName()  , password: "testPassword123!"};
}

// Prep mock database
let mongod;

beforeAll(async () => {
    // This will create a  new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    console.log("Mock Database started");
});

afterAll(async () => {
    await mongod.stop(); // Stop the MongoMemoryServer
    console.log("Mock Database stopped");
});

// initialize a connection to a database before each test
beforeEach(async () => {
    try {
        // Get URL for mock database
        const url = mongod.getUri();
        await databaseConnection.connectToDatabase(url, db)
        .then((conn) => model.setCollection(conn, true));

    } catch (error) {
        console.log(error.message);
    }
})

// Close database connection after each test run
afterEach(async () => {
    await model.close();
});

// =================================================================
// Test Units
// =================================================================


// --------- 
// Create
// ---------
//TODO: Tests should not user model methods
//TODO: test validation methods separately

// Add test 
/**
 * Investigate issue where querying database when adding causes this test to fail 
 * 
 * Side note: sometimes length will be 0, other times 1, run test multiple times 
 * for more accurate results.
*/
test("Can add account to DB", async () => {
    // Generate account data
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };
    
    
    // get collection
    let collection = await model.getCollection();
    
    // add account to database  
    await collection.insertOne(filter); 

    // Query database
    const cursor = await model.getCollection();
    let results = await cursor.find({username: username, password:password}).toArray();// Convert query to array

    // Check Array 
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);

    // Check Pokemon Object from Database 
    expect(results[0].username.toLowerCase() == username.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);
 
});
test("Cannot add duplicate accounts to DB", async () => {
    // Generate account data
    const { email, displayName, username, password } = generateAccountData();

    // Add first account to database  
    await model.addAccount(email, displayName, username, password);

    // Query database
    const cursor = await model.getCollection();
    let results = await cursor.find({username: username, password:password}).toArray();// Convert query to array

    // Check Array 
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);

    // Check Account Object from Database 
    expect(results[0].username.toLowerCase() == username.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);

    // Add second account, expect failure
    await expect(()=> model.addAccount(email, displayName, username ,password)).rejects.toThrow(DatabaseError);
 
});

test("Cannot add account with an empty Username", async () => {
    const { email, displayName, username, password } = generateAccountData();
    const emptyuserName = "";
    
    // expect InvalidInputError exception to be thrown
    await expect(()=> model.addAccount(email, displayName, emptyuserName,password)).rejects.toThrow(InvalidInputError);
});
test("Cannot add account with an empty Display Name", async () => {
    const { email, displayName, username, password } = generateAccountData();
    const emptydisplayName = "";
    
    // expect InvalidInputError exception to be thrown
    await expect(()=> model.addAccount(email, emptydisplayName, username ,password)).rejects.toThrow(InvalidInputError);
});
test("Cannot add account with an invalid Username", async () => {
    const { email, displayName, username, password } = generateAccountData();
    const invalidUsername = "NoSpecialCharacters!_";
    
    // expect InvalidInputError exception to be thrown
    await expect(()=> model.addAccount(email, displayName, invalidUsername ,password)).rejects.toThrow(InvalidInputError);
});
test("Cannot add account with an invalid Display Name", async () => {
    const { email, displayName, username, password } = generateAccountData();
    const invalidDisplayName = "";
    
    // expect InvalidInputError exception to be thrown
    await expect(()=> model.addAccount(email, invalidDisplayName, username ,password)).rejects.toThrow(InvalidInputError);
});
test("Cannot add account with an invalid password", async () => {
    const { email, displayName, username, password } = generateAccountData();
    const invalidPassword = "lamepassword";
    
    // expect InvalidInputError exception to be thrown
    await expect(()=> model.addAccount(email, displayName, username ,invalidPassword)).rejects.toThrow(InvalidInputError);
});

// // -------------
// // Read 
// // -------------

// // Read one
// // while we technically didnt need this one because the add queries, good to check
test("Can read existing account ", async () => {
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database  
    
    // Filter for query
    let filter = { username: username, password: password };
    let collection = await model.getCollection();
    
    // Query database
    let account =  await collection.findOne(filter);
    const cursor = await model.getCollection();
    let results = await cursor.find({username: username}).toArray();// Convert query to array
    
    // Check details from getSingleAccount
    expect(account.username == username).toBe(true);
    expect(account.password == password).toBe(true);
    expect(account.email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(account.displayName == displayName).toBe(true);

    // Check account again but directly from database
    expect(results[0].username == username).toBe(true);
    expect(results[0].password == password).toBe(true);
    expect(results[0].email == email).toBe(true);
    expect(results[0].displayName == displayName).toBe(true);
 
});
test("Can read existing account using model ", async () => {
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database  
    
    // Filter for query
    let filter = { username: username, password: password };
    let collection = await model.getCollection();
    
    // Query database
    let account =  await collection.findOne(filter);

    let modelAccount = await model.getSingleAccount(username);
    logger.info("Account info is " + modelAccount);
    // Check details from getSingleAccount
    expect(account.username == username).toBe(true);
    expect(account.password == password).toBe(true);
    expect(account.email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(account.displayName == displayName).toBe(true);

    // Check model results
    expect(modelAccount.username == username).toBe(true);
    expect(modelAccount.password == password).toBe(true);
    expect(modelAccount.email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(modelAccount.displayName == displayName).toBe(true);
 
});

test("Cannot read account that doesn't exist (Valid name)", async () => {

    // Add some accounts to the database
    const { email, displayName, username, password } = generateAccountData();
    let filter = { username: username, password: password };
    let collection = await model.getCollection();
    
    // TODO: use fakerJS for fake usernames and passwords
    await collection.insertOne(filter);// add account to database  

    let notRealUsername = "KuiHuaReal";
    let result = await collection.findOne({username: notRealUsername});

    // Check account that doesn't exist
    await expect(result == null).toBe(true);
});
test("Cannot read account that doesn't exist (Valid name) using model", async () => {

    // Add some accounts to the database
    const { email, displayName, username, password } = generateAccountData();
    let collection = await model.getCollection();
    
    // add account to database 
    let filter = { username: username, password: password }; 
    await collection.insertOne(filter);

    // Fake Data 
    let notRealUsername = "KuiHuaReal";

    // Check account that doesn't exist
    await expect(()=> model.getSingleAccount(notRealUsername).rejects.toThrow(DatabaseError));
});
// // Read many 
test("Can read entire collection", async () => {

    // Add some accounts to the database
    const { username, password } = generateAccountData();
    let a1 = generateAccountData();
    let a2 = generateAccountData();
    let a3 = generateAccountData();

    // add accounts to database 
    await model.addAccount(a1.email,a1.displayName,a1.username, a1.password)  
    await model.addAccount(a2.email,a2.displayName,a2.username, a2.password)  
    await model.addAccount(a3.email,a3.displayName,a3.username, a3.password)  

    let results = await model.getAllAccounts();

    // Check Array 
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(3);

    // Check all accounts that we just created.
    // Account 1 
    expect(results[0].email.toLowerCase() == a1.email.toLowerCase()).toBe(true);
    expect(results[0].displayName.toLowerCase() == a1.displayName.toLowerCase()).toBe(true);
    expect(results[0].username.toLowerCase() == a1.username.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == a1.password.toLowerCase()).toBe(true);
    // Account 2
    expect(results[1].email.toLowerCase() == a2.email.toLowerCase()).toBe(true);
    expect(results[1].displayName.toLowerCase() == a2.displayName.toLowerCase()).toBe(true);
    expect(results[1].username.toLowerCase() == a2.username.toLowerCase()).toBe(true);
    expect(results[1].password.toLowerCase() == a2.password.toLowerCase()).toBe(true);
    // Account 3
    expect(results[2].email.toLowerCase() == a3.email.toLowerCase()).toBe(true);
    expect(results[2].displayName.toLowerCase() == a3.displayName.toLowerCase()).toBe(true);
    expect(results[2].username.toLowerCase() == a3.username.toLowerCase()).toBe(true);
    expect(results[2].password.toLowerCase() == a3.password.toLowerCase()).toBe(true);
});

// // Update
test("Update username success case", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newUsername = "newUsernameGoCrazy";
    let filter = { username: username, password: password };

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await collection.updateOne(filter,{$set:{username:newUsername}})

    // Find updated document using the new username
    let databaseResult = await collection.findOne({username: newUsername}); // this returns document directly

    // Check that an update was made
    expect(results.modifiedCount === 1).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.username == newUsername).toBe(true);

});
test("Update username success case using model", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newUsername = "newUsernameGoCrazy";
    let filter = { username: username, password: password };

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await model.updateUsername(username, newUsername);

    // Find updated document using the new username
    let databaseResult = await collection.findOne({username: newUsername}); // this returns document directly

    // Check that model returned true
    expect(results === true).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.username == newUsername).toBe(true);


});
test("Update display name success case", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newDisplayName = "newUsernameGoCrazy";
    let filter = { username: username, password: password };

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await collection.updateOne(filter,{$set:{displayName:newDisplayName}})

    // Find updated document using username
    let databaseResult = await collection.findOne({username: username}); // this returns document directly

    // Check that an update was made
    expect(results.modifiedCount === 1).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.displayName == newDisplayName).toBe(true);

});
test("Update display name success case using model", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newDisplayName = "newUsernameGoCrazy";
    let filter = { username: username, password: password };

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await model.updateDisplayName(username, newDisplayName);

    // Find updated document using username
    let databaseResult = await collection.findOne({username: username}); // this returns document directly

    // Check that model returns appropriate boolean
    expect(results === true).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.displayName == newDisplayName).toBe(true);

});
test("Update password success case", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newPassword = "newPasswordReallyGood123!";
    let filter = { username: username, password: password };

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await collection.updateOne(filter,{$set:{password:newPassword}})

    // Find updated document using username
    let databaseResult = await collection.findOne({username: username}); // this returns document directly

    // Check that an update was made
    expect(results.modifiedCount === 1).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.password == newPassword).toBe(true);

});
test("Update password success case using model", async () => {
    
    // create account
    const { email, displayName, username, password } = generateAccountData();
    await model.addAccount(email, displayName, username ,password) // add account to database

    // Prep for update
    let newPassword = "newPasswordReallyGood123!";

    // Easy access to collection
    let collection = await model.getCollection();
    
    // Update specific document in database
    let results = await model.updatePassword(username,password, newPassword)

    // Find updated document using username
    let databaseResult = await collection.findOne({username: username}); // this returns document directly

    // Check that an update was made
    expect(results === true).toBe(true);
    // Verify new username is equal is what we set it to
    expect(databaseResult.password == newPassword).toBe(true);

});

test("Update username failure case - empty name", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidUsername = "";

        
    // Expect method to throw
    await expect(()=> model.updateUsername(username, invalidUsername)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update username failure case - invalid name", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidUsername = "badUsername!_";

        
    // Expect method to throw
    await expect(()=> model.updateUsername(username, invalidUsername)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update username failure case - account does not exist", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidUsername = "badUsername!_";

        
    // Expect method to throw
    await expect(()=> model.updateUsername("nonExisssitnAccount", invalidUsername)).rejects.toThrow(DatabaseError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update username failure case - username is taken", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };
    let secondaccount = generateAccountData();

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    await collection.insertOne(secondaccount);
        
    // Expect method to throw -- updating one account with username of second account
    await expect(()=> model.updateUsername(username, secondaccount.username)).rejects.toThrow(DatabaseError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update displayName failure case - empty name", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidDisplayName = "";

        
    // Expect method to throw
    await expect(()=> model.updateDisplayName(username, invalidDisplayName)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update displayName failure case - Invalid display name", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidDisplayName = "badName!_";

        
    // Expect method to throw
    await expect(()=> model.updateDisplayName(username, invalidDisplayName)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update displayName failure case - account does not exist", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let newDisplayName = "valiNewName";
    let fakeUsername = "this account does not exist";

        
    // Expect method to throw
    await expect(()=> model.updateDisplayName(fakeUsername, newDisplayName)).rejects.toThrow(DatabaseError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update password failure case - empty password", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidPassword = "";

        
    // Expect method to throw
    await expect(()=> model.updatePassword(username,password, invalidPassword)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update password failure case - invalidPassword", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidPassword = "notstrongenough";

        
    // Expect method to throw
    await expect(()=> model.updatePassword(username,password, invalidPassword)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update password failure case - same password", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
        
    // Expect method to throw
    await expect(()=> model.updatePassword(username,password, password)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update password failure case - account does not exist", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let invalidPassword = "notstrongenough";

        
    // Expect method to throw
    await expect(()=> model.updatePassword("FakeAccount",password, invalidPassword)).rejects.toThrow(DatabaseError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
test("Update password failure case - account current password passed in doesnt match currentPass passed in", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    let collection = await model.getCollection();
    await collection.insertOne(filter);
    
    let strongPassword = "goodPassword123!";

        
    // Expect method to throw
    await expect(()=> model.updatePassword(username,"wrongPassword", strongPassword)).rejects.toThrow(InvalidInputError);

     // check if current account has updated
     let accountCollection = await model.getCollection(); // convenient access to collection
     let databaseResult = await accountCollection.findOne({username: username}); // this returns document directly

     // Check that document added has not changed
     expect(databaseResult.email == email).toBe(true);
     expect(databaseResult.displayName == displayName).toBe(true);
     expect(databaseResult.username == username).toBe(true);
     expect(databaseResult.password == password).toBe(true);

});
// // Delete
test("Delete Account success case", async () => {
     
    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    await model.addAccount(email, displayName, username, password);


     let accountCollection = await model.getCollection();
     let result = await accountCollection.deleteOne(filter,true); // true = delete just one

    // validate deleteOne 
    await expect(result.deletedCount == 1).toBe(true);
    await expect(result.acknowledged == true).toBe(true);

});
test("Delete Account success case - using model", async () => {
    
    // easy access to collection
    let collection = await model.getCollection();

    // create account
    const { email, displayName, username, password } = generateAccountData();
    let filter = { email: email, displayName: displayName, username: username, password: password };

    await model.addAccount(email, displayName, username, password);

    let deleteAccount = await model.removeAccount(username, password);

    // validate deleteOne 
    await expect(deleteAccount.username == username).toBe(true);
    await expect(deleteAccount.password == password).toBe(true);

    // make sure account is no longer inside database
    results = await collection.findOne(filter);
    await expect(results == null).toBe(true);

});

test("Delete account failure case -- account does not exist", async () => {
     
     // create account
     const { email, displayName, username, password } = generateAccountData();

     await model.addAccount(email, displayName, username, password);


     let nonExistingUsername = "DarkLordTheThird";
     let filter = { username: nonExistingUsername, password:password };

     let accountCollection = await model.getCollection();
     let result = await accountCollection.deleteOne(filter,true); // true = delete just one

     // check that no documents were deleted
     await expect(result.deletedCount == 0).toBe(true);

});

test("Delete account failure case - using model - account does not exist", async () => {
     
     // create account
     const { email, displayName, username, password } = generateAccountData();

     await model.addAccount(email, displayName, username, password);

     let nonExistingUsername = "DarkLordTheThird";
     // expect model method to throw
     await expect(()=> model.removeAccount(nonExistingUsername, password)).rejects.toThrow(DatabaseError);
});