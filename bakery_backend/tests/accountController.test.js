const InvalidInputError = require('../models/invalidInputError');
const DatabaseError = require('../models/databaseError');
const {faker} = require('@faker-js/faker');
const logger = require("../logger.js");

const model = require('../models/userAccountsModel');
const utils = require('../models/validateUtilsAccounts');
const databaseConnection = require('../models/databaseConnection');
const { MongoMemoryServer} = require('mongodb-memory-server');


// super test
const app = require("../app.js"); 
const supertest = require("supertest");
const testRequest = supertest(app);


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