const validator = require('validator');
const InvalidInputError = require("./invalidInputError.js");
const logger = require("../logger.js");
//test from desktop

/**
 * Validate if account data is valid by checking Email, DisplayName, Username and Password.
 * Checks if display and usernames contain only numbers and letters.
 * Check if password meets minimum requirements.
 * 
 * Minimum requirements: 
 * Usernames: 6 characters long, no special characters.
 * Display Name: 4 characters long, no special characters. 
 * 
 * Passwords: 8 characters long, 1 special char.
 * @param {string} email of the account to validate.
 * @param {string} displayName of the account to validate.
 * @param {string} username of pokemon name to validate.
 * @param {string} password of pokemon type to validate.
 * @throws {InvalidInputError} if pokemon Name or Type is invalid.
 * @returns True if data is valid
 * 
 */
 function isAccountValid(email, displayName, username, password) {

    // Validate All Input -- each will throw appropriate exception if it fails
    isEmailValid(email);
    isDisplayNameValid(displayName);
    isUsernameValid(username);
    isPasswordValid(password);

    // if checks pass, return true
    return true;

}
/**
 * Validate if string passed in is an email.
 * @param {string} email to validate 
 * @throws {InvalidInputError} if email format is invalid
 * @returns {boolean} true if email string passed in, in in fact an email.
 */
function isEmailValid(email){

    logger.info("Email is " + email);
    // User validator isEmail(str,[, options]) ** only checks for format
    if (!validator.isEmail(email))
        throw new InvalidInputError("\nEmail format is invalid. Accepted format: xyz@domain.com");

    return true;
}

/**
 * Checks if Display name is only composed of letters and numbers
 * Special characters and empty names are not allowed.
 * @param {string} displayName to validate
 * @throws InvalidInputError if display name does not meet requirements.
 * @returns {boolean} true if display name meets all requirements
 */
function isDisplayNameValid(displayName){
    
    // Check length meets minimum requirements (4) - REDACTED
   // if(displayName.   Q1`ASlength < 4)
    //    throw new InvalidInputError("\nUsername must be at least 4 characters long.");
    
    // Check for special characters
    if(!validator.isAlphanumeric(displayName))
        throw new InvalidInputError("\nSpecial Characters are not allowed");

    // If all checks pass, return true
    return true;
    
}

/**
 * Validates if string of username meets minimum requirements.
 * 
 * Minimum requirements are: name is composed of letters and numbers exclusively.
 * @param {true} username to validate.
 * @throws {InvalidInputError} if username does not meet minimum requirements.
 * @returns true if username meets minimum requirements.
 */
function isUsernameValid(username){

    // Check length meets minimum requirements. - REDACTED
    // if(username.length < 6)
     //   throw new InvalidInputError("\nUsername must be at least 6 characters long");

    // Check for special characters
    if(!validator.isAlphanumeric(username))
        throw new InvalidInputError("\nSpecial Characters are not allowed");

    // If all checks pass, return true
    return true;
}


/**
 * Check if password meets minimum requirements.
 * 
 * Minimum requirements
 * Is at least 8 characters long.
 * Contains one number.
 * Contains one special character.
 * @param {string} password to validate. 
 * @throws {InvalidInputError} if password is not valid.
 * @returns true if password meets minimum requirements
 */
function isPasswordValid(password){

    // Filter for isStrongPassword, 
    strongPasswordOptions = {minLength: 8, minNumbers: 1, minSymbols: 1}

    // If password does not meet strongPasswordOptions criteria, returns false.
    if(!validator.isStrongPassword(password, strongPasswordOptions))
        throw new InvalidInputError("\nPassword is not strong enough: Must be at least 8 characters long, contains 1 number and one special character.");
    
    return true;
}


module.exports ={
    isAccountValid,
    isEmailValid,
    isDisplayNameValid,
    isUsernameValid,
    isPasswordValid,
}