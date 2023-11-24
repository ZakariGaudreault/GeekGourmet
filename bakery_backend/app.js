const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const logger = require('./logger');
const pinohttp = require('pino-http');
const httpLogger = pinohttp({
  logger: logger
});
app.use(httpLogger);

const bodyParser = require("body-parser");
const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONT_END,
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Accept, Content-Type, Authorization"); 
res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
res.setHeader("Access-Control-Allow-Credentials", true);
res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH");
next();
});
app.use(cookieParser());

const controllers = ['userAccountsController', 'recipesController', 'recipeBooksController', 'sessionController', 'errorController'];

app.use(express.json());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register routes from all controllers 
//  (Assumes a flat directory structure and common 
// 'routeRoot' / 'router' export)
controllers.forEach((controllerName) => {
    try {
      const controllerRoutes = require('./controllers/' + controllerName);
      app.use(controllerRoutes.routeRoot, controllerRoutes.router);
    } 
    catch (error) {      
    console.log(error);
    // We could fail gracefully, but this would hide bugs later on.
    throw error; 
    }    
});
  
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));

module.exports = app