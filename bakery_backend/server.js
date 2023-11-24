require("dotenv").config();
const app = require('./app.js');
const port = 1339;
const url = process.env.URL_PRE + process.env.MONGODB_PWD + process.env.URL_POST;

//models
const databaseConnection = require('./models/databaseConnection.js');
const userAccountsModel = require("./models/userAccountsModel.js");
const recipesModel = require("./models/recipesModel.js");
const recipeBooksModel = require("./models/recipeBooksModel.js");

//Connects to the database and passes the connection to the models
databaseConnection.connectToDatabase(url, "bakery_db").
then((db) =>{
    userAccountsModel.setCollection(db, false).
    then(recipesModel.setCollection(db, false)).
    then(recipeBooksModel.setCollection(db, false))
}).
then(app.listen(port));

