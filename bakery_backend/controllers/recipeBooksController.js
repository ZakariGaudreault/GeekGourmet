const express = require('express');
const router = express.Router();
const routeRoot = '/book';
const logger = require('../logger.js');
const recipeBooksModel = require("../models/recipeBooksModel.js");
const model = require('../models/recipeBooksModel.js');
const DatabaseError  = require('../models/databaseError.js');
const  InvalidInputError  = require('../models/invalidInputError.js');
const {authenticateUser, refreshSession} = require('./sessionController.js');

/**
 * Adds a recipe book into the database and sends a response status depending of the result
 * being positive or negative 
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.post('/', addBook);
async function addBook(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

    const added = await model.addBook(authenticatedSession.userSession.username, request.body.name);
    if(added){
    response.status("200");
    response.send(added)
    }
    else{
        response.status("400");
        response.send("failed to add recipe book");
    }
    }
    catch(err)
    {
        console.log("Failed to add a recipe book: " + err.message);
        if(err instanceof DatabaseError){
            response.status("500");
            response.send({ errMessage: "system error while trying to add recipe book: "+ err.message});
        }
        else if(err instanceof InvalidInputError){
            response.status("400");
            response.send({ errMessage: "Validation error while trying to add recipe book: "+ err.message});
        }
        else{
            response.status("500");
            response.send({ errMessage: "Unexpected error while trying to add recipe book: "+ err.message});
        }
        
    }
}


/**
 * gets a recipe book from the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.get('/user/:name', findBook);
async function findBook(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

        let answer = await model.getSingleRecipeBook(authenticatedSession.userSession.username, request.params.name)
    
        if(answer != null){
            response.status("200");
            response.send(answer)
            }
            else{
                response.status("400");
                response.send({ errMessage: "Validation error while trying to find recipe book: " + request.params.name + " does not exist"});
            }
    
        }
        catch(err)
        {
            console.log("Failed to delete a recipe: " + err.message);
            if(err instanceof DatabaseError){
                response.status("500");
                response.send({ errMessage: "system error while trying to find recipe book: "+ err.message});
            }
            else if(err instanceof InvalidInputError){
                response.status("400");
                response.send({ errMessage: "Validation error while trying to find recipe book: "+ err.message});
            }
            else{
                response.status("500");
                response.send({ errMessage: "Unexpected error while trying to find recipe book: "+ err.message});
            }
            
        }
}

/**
 * find all the recipe books from the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.get('/', findAllBooks);
async function findAllBooks(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

    let answer = await model.getAllRecipeBooks()
 
    if(answer != null){
        response.status("200");
        response.send(answer)
    }

    else{
    response.send("There is no recipe book in the database currently");
    }

    }
    catch(err)
    {
        if(err instanceof DatabaseError){
            response.status("500");
            response.send("system error while trying to get all recipes book: "+ err.message);
        }
        else if(err instanceof InvalidInputError){
            response.status("400");
            response.send("Validation error while trying to get all find recipes book" + err.message);
        }
        else{
            response.status("500");
            response.send("unexpected error while trying to get all find recipes book: "+ err.message);
        }
    }
}

router.get("/user", showAllRecipeBookOfOneUser);
/**
 * Gets all the recipes book of one user
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
async function showAllRecipeBookOfOneUser(request, response){
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

    let answer = await model.getAllRecipeBooksOfUser(authenticatedSession.userSession.username)
 
    if(answer != null){
        response.status("200");
        response.send(answer)
    }

    else{
    response.send("This is user does not have any recipe books.");
    }

    }
    catch(err)
    {
        if(err instanceof DatabaseError){
            response.status("500");
            response.send("system error while trying to get all recipes book: "+ err.message);
        }
        else if(err instanceof InvalidInputError){
            response.status("400");
            response.send("Validation error while trying to get all find recipes book" + err.message);
        }
        else{
            response.status("500");
            response.send("unexpected error while trying to get all find recipes book: "+ err.message);
        }
    }

}

/**
 * delete a recipe book into the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.delete('/', deleteBook);
async function deleteBook(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

    let answer = await model.deleteRecipeBook(authenticatedSession.userSession.username, request.body.name)

    if(answer.deletedCount == 1){
        response.status("200");
        response.send(answer)
        }
        else{
            response.status("400");
            response.send({ errMessage: "Validation error while trying to delete the recipe book: " + request.body.name + " because it does not exist"});
        }

    }
    catch(err)
    {
        console.log("Failed to delete a recipe book: " + err.message);
        if(err instanceof DatabaseError){
            response.status("500");
            response.send({ errMessage: "system error while trying to delete recipe book: "+ err.message});
        }
        else if(err instanceof InvalidInputError){
            response.status("400");
            response.send({ errMessage: "Validation error while trying to delete recipe book: "+ err.message});
        }
        else{
            response.status("500");
            response.send({ errMessage: "Unexpected error while trying to delete recipe book: "+ err.message});
        }
        
    }
}


/**
 * update a recipe book name into the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.put('/name', updateBookName);
async function updateBookName(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

    let answer = await model.updateRecipeBookName(authenticatedSession.userSession.username, request.body.name,request.body.newName)

    if(answer.modifiedCount != 0){
        response.status("200");
        const recipe =  await model.getSingleRecipeBook(authenticatedSession.userSession.username, request.body.newName);
        response.send(recipe);
    }

    else{
        response.status("400");
        response.send({ errMessage: "Validation error while trying to update recipe book: " + request.body.name + " does not exist or the new name is invalid"});
    }

    }
    catch(err)
    {
        console.log("Failed to delete a recipe: " + err.message);
        if(err instanceof DatabaseError){
            response.status("500");
            response.send({ errMessage: "system error while trying to update recipe book: "+ err.message});
        }
        else if(err instanceof InvalidInputError){
            response.status("400");
            response.send({ errMessage: "Validation error while trying to update recipe book: "+ err.message});
        }
        else{
            response.status("500");
            response.send({ errMessage: "Unexpected error while trying to update recipe book: "+ err.message});
        }
    }
}

/**
 * update a recipe book content by adding a recipe in the saved recipes into the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.put('/content/new', addRecipeInBook);
async function addRecipeInBook(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

        let answer = await model.updateBookAddRecipe(authenticatedSession.userSession.username, request.body.name,request.body.recipeId)
    
        if(answer.modifiedCount != 0){
            response.status("200");
            const recipe =  await model.getSingleRecipeBook(authenticatedSession.userSession.username, request.body.name);
            response.send(recipe);
        }
    
        else{
            response.status("400");
            response.send({ errMessage: "Validation error while trying to update recipe book : " + request.body.name + " does not exist or the new content is invalid"});
        }
    
        }
        catch(err)
        {
            console.log("Failed to delete a recipe: " + err.message);
            if(err instanceof DatabaseError){
                response.status("500");
                response.send({ errMessage: "system error while trying to update recipe book: "+ err.message});
            }
            else if(err instanceof InvalidInputError){
                response.status("400");
                response.send({ errMessage: "Validation error while trying to update recipe book: "+ err.message});
            }
            else{
                response.status("500");
                response.send({ errMessage: "Unexpected error while trying to update recipe book: "+ err.message});
            }
        }
    
}

/**
 * update a recipe book name by deleting a recipe in the saved recipes into the database and sends a response status depending of the result
 * being positive or negative
 * @param {*} response the response object from the server
 * @param {*} request the request object from the server
 */
router.put('/content/removal', deleteRecipeInBook);
async function deleteRecipeInBook(request, response) {
    try{

        const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
            response.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(request, response);

        let answer = await model.updateBookDeleteRecipe(authenticatedSession.userSession.username, request.body.name,request.body.recipeId)
    
        if(answer.modifiedCount != 0){
            response.status("200");
            const recipe =  await model.getSingleRecipeBook(authenticatedSession.userSession.username, request.body.name);
            response.send(recipe);
        }
    
        else{
            response.status("400");
            response.send({ errMessage: "Validation error while trying to update recipe book : " + request.body.name + " does not exist or the new content is invalid"});
        }
    
        }
        catch(err)
        {
            console.log("Failed to delete a recipe: " + err.message);
            if(err instanceof DatabaseError){
                response.status("500");
                response.send({ errMessage: "system error while trying to update recipe book: "+ err.message});
            }
            else if(err instanceof InvalidInputError){
                response.status("400");
                response.send({ errMessage: "Validation error while trying to update recipe book: "+ err.message});
            }
            else{
                response.status("500");
                response.send({ errMessage: "Unexpected error while trying to update recipe book: "+ err.message});
            }
        }
    
}



module.exports = {
    router,
    routeRoot,
}