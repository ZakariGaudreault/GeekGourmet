const express = require('express');
const router = express.Router();
const routeRoot = '/';
const logger = require('../logger.js');
const recipesModel = require("../models/recipesModel.js");
const {authenticateUser, refreshSession} = require('./sessionController.js');
const InvalidInputError = require('../models/invalidInputError.js');
const DatabaseError = require('../models/databaseError.js');


router.post('/recipe', createRecipe);
/**
 * Handles the creation of a new recipe
 * 
 * @param {object} req request object with body containing : userId, title, ingredients, serving and instructions 
 * @param {object} res response object with body containing the recipe object
 */
async function createRecipe(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);
        
        let userId = authenticatedSession.userSession.username;
        let title = "";
        let type ="";
        let ingredients = "";
        let servings = "";
        let instructions = "";

        if(req.body.title != null)
            title = req.body.title;

        if(req.body.type != null)
            type = req.body.type;

        if(req.body.ingredients != null)
            ingredients = req.body.ingredients;

        if(req.body.servings != null)
            servings = req.body.servings;

        if(req.body.instructions != null)
            instructions = req.body.instructions

        let result = await recipesModel.addNewRecipe(userId, title, ingredients, servings, instructions, type);

        if(result == null){
            output = "Something went wrong with user input. Recipe was not created.";
            logger.error(output);
            throw new InvalidInputError(output);
        }

        res.status("200");
        output = "Successfully created recipe : " + title;
        logger.info(output);
        res.send(result);
    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }

}

router.get('/recipe', showRecipes);
/**
 * Handles the retrieving of all the recipes 
 * 
 * @param {object} req request object 
 * @param {object} res response object with body containing an array of recipe objects
 */
async function showRecipes(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let result = await recipesModel.getRecipes();

        if(result == null){
            output = "Failed to retrieve recipes"
            logger.error(output);
            throw new InvalidInputError(output);
        }

        res.status("200");
        output = "Successfully retrieved all recipes";
        logger.info(output);
        res.send(result);
    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}

router.get('/recipe/user', showRecipesOfOneUser);
/**
 * Handles the retrieving of all recipes of one user
 * 
 * @param {object} req request object with the parameters containing the userId 
 * @param {object} res response object with the body containing an array of the user's recipes
 */
async function showRecipesOfOneUser(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let userId = authenticatedSession.userSession.username;

        let result = await recipesModel.getRecipesOfOneUser(userId);

        if(result == null){
            output = userId + " does not have any recipes.";
            logger.error(output);
            throw new InvalidInputError(output);
        }
        else{
            output = "Successfully retrieved all recipes of : " + userId;
            res.status("200");
            logger.info(output);
            res.send(result);
        }

    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}


router.get('/recipe/user/:title', showOneRecipe);
/**
 * Handles the retrieving of a recipe
 * 
 * @param {object} req request object with the parameters containing the userId and title
 * @param {object} res response object with the body containing the specified recipe object 
 */
async function showOneRecipe(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let userId = authenticatedSession.userSession.username;
        let title = req.params.title;

        let result = await recipesModel.getOneRecipe(userId, title);

        if(result == null){
            output = "Inexistent recipe by "+ userId +": " + title;
            logger.error(output);
            throw new InvalidInputError(output);
        }
        else{
            output = "Successfully retrieved recipe: " + title;
            res.status("200");
            logger.info(output);
            res.send(result);
        }

    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}

router.get('/recipe/user/id/:id', showOneRecipeById);
/**
 * Handles the retrieving of a recipe using Id
 * 
 * @param {object} req request object with the parameters containing the userId and title
 * @param {object} res response object with the body containing the specified recipe object 
 */
async function showOneRecipeById(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let userId = authenticatedSession.userSession.username;
        let id = req.params.id;

        let result = await recipesModel.getOneRecipeById(userId, id);

        if(result == null){
            output = "Inexistent recipe by "+ userId +": " + result.title;
            logger.error(output);
            throw new InvalidInputError(output);
        }
        else{
            output = "Successfully retrieved recipe: " + result.title;
            res.status("200");
            logger.info(output);
            res.send(result);
        }

    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}

router.put('/recipe/:title', updateRecipe);
/**
 * Handles the updating of a recipe
 * 
 * @param {object} req request object with the parameters containing the userId and title and the body containing
 * the new title, ingredients, servings and instructions
 * @param {object} res response object with the body containing the updated recipe object 
 */
async function updateRecipe(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let userId = authenticatedSession.userSession.username;
        let title = req.params.title;

        let newTitle = "";
        let newType = "";
        let newIngredients = "";
        let newServings = "";
        let newInstructions = "";

        //Checks which data fields have a new value 
        if(req.body.newTitle != null)
            newTitle= req.body.newTitle;

        if(req.body.newType != null)
            newType= req.body.newType;

        if(req.body.newIngredients != null)
            newIngredients = req.body.newIngredients;

        if(req.body.newServings != null)
            newServings = req.body.newServings;

        if(req.body.newInstructions != null)
            newInstructions = req.body.newInstructions;

        let result = await recipesModel.updateRecipe(userId, title, newTitle, newType, newIngredients, newServings, newInstructions);

        if(result.updateResult.modifiedCount > 0){
            output = "Successfully updated recipe: " + title;
            res.status("200");
            logger.error(output);
            res.send(result.recipe);
        }
        else{
            output = "Failed to update recipe: " + title;
            logger.info(output);
            throw new InvalidInputError(output);
        }
    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}

router.delete('/recipe/:title', deleteRecipe);
/**
 * Handles the deleting of a recipe
 * 
 * @param {object} req request object with the parameters containing the userId and title
 * @param {object} res response object with the body containing an object with a boolean acknowledged and integer deletedCount as well as the recipe object
 */
async function deleteRecipe(req, res){
    let output;

    try{
        const authenticatedSession = authenticateUser(req);
        if (!authenticatedSession) {
            res.sendStatus(401); // Unauthorized access
            return;
        }
        refreshSession(req, res);

        let userId = authenticatedSession.userSession.username;
        let title = "";

        if(req.params.userId != null)
            userId = req.params.userId;

        if(req.params.title != null)
            title = req.params.title;

        let result = await recipesModel.deleteRecipe(userId, title);

        if(result.deleteResult.deletedCount > 0){
            output = "Successfully deleted recipe: " + title;
            res.status("200");
            logger.info(output);
            res.send(result.recipe);
        }
        else{
            output = "Failed to delete recipe: " + title;
            logger.error(output);
            throw new InvalidInputError(output);
        }
        
    }
    catch(error){
        if(error instanceof DatabaseError){
            output = "***A database error occurred: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else if(error instanceof InvalidInputError){
            output = "***An input error occurred: " + error.message;
            res.status("400");
            logger.error(output);
            res.send({errorMessage: output});
        }
        else{
            output = "***Unexpected error encountered: " + error.message;
            res.status("500");
            logger.error(output);
            res.send({errorMessage: output});
        }
    }
}

module.exports = {
    router,
    routeRoot
}