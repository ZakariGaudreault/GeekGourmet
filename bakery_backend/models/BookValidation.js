var validator = require('validator');
const InvalidInputError = require("./invalidInputError");

/**
 * Validates that the book name is not over 25 characters long and is not empty
 * @param {string} name book name
 * @returns True if the name is valid. Error otherwise.
 */
function isValid2(name) {
    if (name.length > 25 || !name.replace(/\s/g, '').length) {
        throw new InvalidInputError("Name was empty or was too long. Please do not add anything over 25 characters");
    }
    return true;
}  


module.exports = { isValid2 };