const validator = require('validator');
const logger = require('../logger.js'); 
const InvalidInputError = require("./invalidInputError");

/**
 * Validates all the input fields of the recipe object
 * 
 * @param {string} userId username
 * @param {string} title title of recipe
 * @param {string} ingredients ingredients  of recipe
 * @param {string} servings number of servings of recipe
 * @param {string} instructions instructions of recipe
 * @returns True if all fields are valid. An error otherwise.
 * @throws InvalidInputError if any of the fields are invalid
 */
function areFieldsValid(userId, title, ingredients, servings, instructions){
    let errMsg;

    if(validator.isEmpty(userId)){
        errMsg += "Username is required."
    }

    if(validator.isEmpty(title)){
        errMsg += "Title is required."
    }

    if(validator.isEmpty(ingredients)){
        errMsg += "Ingredients are required."
    }

    if(validator.isEmpty(servings)){
        errMsg += "Number of servings are required."
    }

    if(!validator.isNumeric(servings)){
        errMsg += "Number of serving is invalid.";
    }

    if(validator.isEmpty(instructions)){
        errMsg += "Instructions are required."
    }

    if(errMsg != null){
        logger.error(errMsg);
        throw new InvalidInputError(errMsg);
    }

    return true;
}

/**
 * Validates that the servings value is a valid number
 * 
 * @param {string} serving Number of servings
 * @returns True if servings is a number.
 * @throws InvalidInputError if any of the fields are invalid
 */
function isServingsValid(serving){
    let errMsg;

    if(!validator.isNumeric(serving)){
        errMsg += "Number of serving is invalid.";
    }

    if(errMsg != null){
        logger.error(errMsg);
        throw new InvalidInputError(errMsg);
    }

    return true;
}

/**
 * Validates the key fields, userId and title
 * 
 * @param {string} userId username
 * @param {string} title title of recipe
 * @returns True if all fields are valid.
 * @throws InvalidInputError if any of the fields are invalid 
 */
function areKeyValid(userId, title){
    let errMsg;

    if(validator.isEmpty(userId)){
        errMsg += "Username is required."
    }

    if(validator.isEmpty(title)){
        errMsg += "Title is required."
    }
    
    if(errMsg != null){
        logger.error(errMsg);
        throw new InvalidInputError(errMsg);
    }

    return true;
}

module.exports = {areFieldsValid, areKeyValid, isServingsValid};