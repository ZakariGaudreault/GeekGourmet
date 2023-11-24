const express = require('express');
const router = express.Router();
const routeRoot = '/';
const logger = require('../logger.js');
const accountModel = require("../models/userAccountsModel.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Error handlers
const DatabaseError= require("../models/databaseError.js");
const InvalidInputError= require("../models/invalidInputError.js");

// End Points
// refer to project documentation for more information
router.post('/account', createAccount);
router.get('/account/:username', showAccount);
router.get('/account/', showAllAccounts);
router.put('/account/editusername',editUsername);
router.put('/account/editpassword',editPassword);
router.put('/account/editdisplayName',editDisplayName);
router.delete('/account', deleteAccount);

/** Returns true if there is a stored user with the same username and password. */
async function checkCredentials(username, password) {
    let account = await accountModel.getSingleAccount(username);

    return await bcrypt.compare(password, account.password);
}


 /**
 * Creates an account object from request body parameters.
 * @param {*} request Express request expecting body of email, displayname, username and password
 * @param {*} response Sends a successful response, 400 level response if input is invalid
 *                       a 500 level response if there is a system error.
 */
 async function createAccount(request, response) {
    logger.info("Inside of createAccount, in account controller");
    // Body parameters for account doc
    let email = request.body.email;
    let displayName = request.body.displayName;
    let username = request.body.username;
    let password = request.body.password;

    logger.debug(`JSON BODY INFO: email: ${email}, display: ${displayName}, username: ${username}, password: ${password}`);
    
   // create account object
   try {

        let account = await accountModel.addAccount(email, displayName, username, password);
        logger.debug("Account created: " + account);

        // if account is null (Unexpected), handle appropriately
        if(account == null || account == undefined) {
            logger.fatal("Account add account returned something other than object, should NEVER happen");
            response.status(500)
            response.send({errorMessage:`Unexpected error while adding account with: \n Name: ${account.username} \n Type: ${account.password}`});
        }else{
            response.status(200)
            response.send(account); // Send back account object for front end
        }

            

   } catch (err){
        // User Input Error
        if(err instanceof InvalidInputError){
            logger.error("Invalid input error while creating an account: " + err.message);
            response.status(406); // note acceptable status code
            response.send({errorMessage:"Error while creating account: " + err.message});
        }
        // Database Error
        else if(err instanceof DatabaseError){
            logger.error("Database Error while creating an account: " + err.message);
            response.status(500)
            response.send({errorMessage:"Error while creating account: " + err.message});
        }
        // Unknown Error
        else{
            response.status(500)
            logger.warn("Unexpected error while creating an account" + err.message);
            response.send({errorMessage: "Unexpected error while adding account: " + err.message} );
        }
   }
}

/**
 * Query database for a single instance of an account.
 * Sends a response with the account information if available.
 * Sends 500 level response if account could not be found due to a database error or if it does not exist
 * @param {*} request Express request expecting body data of username
 * @param {*} response Sends a successful response with account object if account is found.
 *                     a 500 level response if account could not be found
 */
async function showAccount(request, response) {

    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    refreshSession(request, response);

    // get the name from cookie;
    let username = authenticatedSession.userSession.username;
    logger.debug("username value: " + username)

   try {

        let account = await accountModel.getSingleAccount(username);
        logger.debug("Account result: " + account);
        // if account is null, handle appropriately (unexpected)
        if(account == null){
            logger.fatal("Account add account returned something other than object, should NEVER happen");
            response.status(500)
            response.send({errorMessage:"Apologies, account was not found inside of database"});
        }
        else{
                response.status(200);
                response.send(account);

        } 
            

   } catch (err){
        // Database
        if(err instanceof DatabaseError){
            logger.error("Database Error while getting account information" + err.message);
            response.status(500)
            response.send({errorMessage:"Error while finding account: " + err.message});
        }
        // Unknown Error
        else{
            response.status(500)
            logger.error("Unexpected Error while getting account information" + err.message);
            response.send({errorMessage:"Unexpected error while finding account: " + err.message});
        }
   }
}
/**
 * Query database for all accounts inside of a mongo db.
 * Sends a response with the account list if available.
 * Sends 500 level response if accounts could not be queried due to a database error.
 * @param {*} request Express request expecting body data of username
 * @param {*} response Sends a successful response if account is found.
 *                     a 500 level response if account could not be found
 */
async function showAllAccounts(request, response) {

   try {

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

        let accounts = await accountModel.getAllAccounts();
        logger.debug("Account result: " + accounts);
        // if pokemon is null, handle appropriately
        if(accounts == null){
            logger.fatal("Accounts should not return null");
            response.status(404)
            response.send({errorMessage:"Apologies, could not get all accounts"});
        }
        else{
                response.status(200);
                response.send(accounts);
        } 
            

   } catch (err){
        // Database
        if(err instanceof DatabaseError){
            logger.error("Database Error while getting account information" + err.message);
            response.status(500)
            response.send({errorMessage:"Error while finding account: " + err.message});
        }
        // Unknown Error
        else{
            response.status(500)
            logger.error("Unexpected Error while getting account information" + err.message);
            response.send({errorMessage:"Unexpected error while finding account: " + err.message});
        }
   }
}


/**
 * Queries database for instance of account with same username.
 * Validate new username, then update account with new username if valid.
 * Sends object containing oldUsername and newUsername
 * @param {*} request Express request expecting a JSON request with username and newUsername in body
 * @param {*} response 200 response if account is found and updated. 
 *                     404 response if account is not found.
 *                     500 level response if updating account fails.
 *                     500 level responses can be sent if new username is taken or if updating fails.
 *              
 */
async function editUsername(request, response){

    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    refreshSession(request, response);

    // Body params for new username
    let username = authenticatedSession.userSession.username;
    let newUsername = request.body.newUsername;
    logger.debug("Json body from modify request: name: " + username + ", newName: " + newUsername);
   // updating account username
   try {

        let account = await accountModel.updateUsername(username, newUsername);
        logger.debug("Account update result values  " + account);

        // if account object is null handle approriately (Unexpected)
        if(account == null || account == undefined) {
            logger.fatal("editUsername returned null or undefined, should never happen")
            response.status(500)
            response.send({errorMessage: `Unexpected error while updating account with: \n Name: ${username}`});
        }else if(account == true) {
            response.status(200)
            response.send({oldName: username, newName: newUsername}); // return object for front end
        }else if(account == false) {
            response.status(200)
            response.send({oldName: "Account not found", newName:"Account not found"});
        }

            

   } catch (err){
        // User Input Error
        if(err instanceof InvalidInputError){
            logger.error("Invalid input error while updating an account " + err.message);
            logger.error("Values passes in: " + username + newUsername);
            response.status(406); // not acceptable status code
            response.send({errorMessage: "Error while updating account: " + err.message});
        }
        // Database Error
        else if(err instanceof DatabaseError){
            logger.error("Database error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Error while updating account: " + err.message});
        }
        // Unknown Error
        else{
            logger.warn("Unknown error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Unexpected error while updating account: " + err.message});
        }
   }
}
/**
 * Queries database for instance of account with same username.
 * Validates new password and current password.
 * returns object with username and new password
 * @param {*} request Express request expecting a JSON request with username, current password and newPassword
 * @param {*} response 200 response if account is found and updated. 
 *                     404 response if account is not found.
 *                     500 level response if updating account fails.
 *                     500 level responses can be sent if new username is taken or if updating fails.
 *              
 */
async function editPassword(request, response){

    let test;
    const {authenticateUser, refreshSession} = require('./sessionController.js');
    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    refreshSession(request, response);

    // Body params for new username
    let username = authenticatedSession.userSession.username;
    let password = request.body.password;
    let newPassword = request.body.newPassword;
    logger.debug("Json body from modify request: name: " + username + ", password: " + password + ", new pass : " + newPassword);
   // updating account username
   try {

        let account = await accountModel.updatePassword(username, password, newPassword);
        logger.debug("Account update result values  " + account);

        // if account object is null handle approriately (Unexpected)
        if(account == null || account == undefined) {
            logger.fatal("editPassword returned null or undefined, should never happen")
            response.status(500)
            response.send({errorMessage: `Unexpected error while updating account with: \n Name: ${username}`});
        }else if(account == true) {
            response.status(200)
            response.send({username: username, password: newPassword}); // return object for front end
        }else if(account == false) {
            response.status(200)
            response.send({oldName: "Account not found", newName:"Account not found"});
        }

            

   } catch (err){
        // User Input Error
        if(err instanceof InvalidInputError){
            logger.error("Invalid input error while updating an account " + err.message);
            logger.error("Values passed in: " + username + password + newPassword);
            response.status(406); // not acceptable status code
            response.send({errorMessage: "Error while updating account: " + err.message});
        }
        // Database Error
        else if(err instanceof DatabaseError){
            logger.error("Database error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Error while updating account: " + err.message});
        }
        // Unknown Error
        else{
            logger.warn("Unknown error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Unexpected error while updating account: " + err.message});
        }
   }
}

/**
 * Queries database for instance of account with same username.
 * Validate new username, then update account with new username if valid.
 * Sends object containing oldUsername and newUsername
 * @param {*} request Express request expecting a JSON request with username and newDisplayName in body
 * @param {*} response 200 response if account is found and updated. 
 *                     404 response if account is not found.
 *                     500 level response if updating account fails.
 *                     500 level responses can be sent if new username is taken or if updating fails.
 *              
 */
async function editDisplayName(request, response){

    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    refreshSession(request, response);

    // Body params for new username
    let username = authenticatedSession.userSession.username;
    let newDisplayName = request.body.newDisplayName;
    logger.debug("Json body from modify request: name: " + username + ", newDisplayName: " + newDisplayName);
   // updating account username
   try {

        let account = await accountModel.updateDisplayName(username, newDisplayName);
        logger.debug("Account update result values  " + account);

        // if account object is null handle approriately (Unexpected)
        if(account == null || account == undefined) {
            logger.fatal("editUsername returned null or undefined, should never happen")
            response.status(500)
            response.send({errorMessage: `Unexpected error while updating account with: \n Name: ${username}`});
        }else if(account == true) {
            response.status(200)
            response.send({oldName: username, newName: newDisplayName}); // return object for front end
        }else if(account == false) {
            response.status(200)
            response.send({oldName: "Account not found", newName:"Account not found"});
        }

            

   } catch (err){
        // User Input Error
        if(err instanceof InvalidInputError){
            logger.error("Invalid input error while updating an account " + err.message);
            logger.error("Values passes in: " + username + newDisplayName);
            response.status(406); // not acceptable status code
            response.send({errorMessage: "Error while updating account: " + err.message});
        }
        // Database Error
        else if(err instanceof DatabaseError){
            logger.error("Database error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Error while updating account: " + err.message});
        }
        // Unknown Error
        else{
            logger.warn("Unknown error while updating an account " + err.message);
            response.status(500)
            response.send({errorMessage:"Unexpected error while updating account: " + err.message});
        }
   }
}

/**
 * Deletes account document from json body request containing username and password.
 * @param {*} request Express request expecting JSON body with username and password.
 * @param {*} response 200 level response if delete was successful.
 *                     406 level response if username or password is invalid.
 *                     500 level response if delete was unsuccessful.
 * 
 */
async function deleteAccount(request, response){

    const {authenticateUser, refreshSession} = require('./sessionController.js');
    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    refreshSession(request, response);

    // Body params for new username
    let username = authenticatedSession.userSession.username;
    let password = request.body.password;
    logger.debug("remove account json request info - name: " + username + ", password: " + password);

   // deleting account
   try {

         let account = await accountModel.removeAccount(username, password);
         logger.debug("Account value : " + account);
         // if account is null, handle appropriately (unexpected)
         if(account == null || account == undefined) {
        
             response.status(500)
             response.send({errorMessage:`Unexpected error while deleting account with: \n Name: ${account.name}`});
         }else{
             response.status(200)
             response.send(account);
         }

            

   } catch (err){
        // User Input Error
        if(err instanceof InvalidInputError){
         logger.error("Invalid Input Error while deleting an account" + err.message);
            response.status(406); // not acceptable status code
            response.send({errorMessage:"Error while deleting account: " + err.message});
        }
        // Database Error
        else if(err instanceof DatabaseError){
         logger.error("Database Error while deleting an account" + err.message);
            response.status(500)
            response.send({errorMessage:"Error while deleting account: " + err.message});
        }
        // Unknown Error
        else{
         logger.warn("Unexpected Error while deleting an account" + err.message);
            response.status(500)
            response.send({errorMessage:"Unexpected error while delete account: " + err.message});
        }
   }
}
module.exports = {
    router,
    routeRoot,
    checkCredentials
}