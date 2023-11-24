const express = require("express");
const { Session, createSession, getSession, deleteSession } = require("./Session")
const router = express.Router(); 
const routeRoot = "/session";
const {checkCredentials} = require("./userAccountsController");
const logger = require('../logger');

router.post("/login", loginUser);
/**
 * Verifies the users and logs them in
 * 
 * @param {object} request request object with the body containing the username and password 
 * @param {object} response response object that sens 200 status when log in is successful. Otherwise, 401.
 * @returns 
 */
async function loginUser(request, response) {
    try{
        const username = request.body.username;
        const password = request.body.password;
    
        if(username && password) {
            if(await checkCredentials(username, password)){
                logger.info("Successfully logged in for " + username);
    
                // Create a session object that will expire in 20 minutes
                const sessionId = createSession(username, 30); 
    
                    // Save cookie that will expire.
                response.cookie("sessionId", sessionId, { expires: getSession(sessionId).expiresAt , httpOnly: true});
                response.sendStatus(200);
                return;
            }
            else{
                logger.error("Unsuccessfully logged in for " + username);
            }
        }
        else{
            logger.error("Unsuccessfully logged in for " + username);
        }
        response.sendStatus(401);    
    }
    catch(e){
        logger.error("Unsuccessfully logged in");
        response.sendStatus(401);    
    }
};

/**
 * Authenticates the users
 * 
 * @param {object} request request object that contains the cookie information
 * @returns session information
 */
function authenticateUser(request) {
    // If this request doesn't have any cookies, that means it isn't authenticated. Return null.
    if (!request.cookies) {
        return null;
    }
    
    // We can obtain the session token from the requests cookies, which come with every request
    const sessionId = request.cookies['sessionId']
    if (!sessionId) {
    // If the cookie is not set, return null
    return null;
    }

    // We then get the session of the user from our session map
    userSession = getSession(sessionId);
    if (!userSession) {
        return null;
    }

    // If the session has expired, delete the session from our map and return null
    if (userSession.isExpired()) {
    deleteSession(sessionId);
        return null;
    }

    return {sessionId, userSession}; // Successfully validated.
}

/**
 * Refreshes the session
 * 
 * @param {object} request request object that contains cookie information
 * @param {object} response response object that contains the new cookie information
 * @returns new session id
 */
function refreshSession(request, response) {
    const authenticatedSession = authenticateUser(request);
        if (!authenticatedSession) {
    response.sendStatus(401); // Unauthorized access
    return;
    }
    // Create and store a new Session object that will expire in 2 minutes.
    const newSessionId = createSession(authenticatedSession.userSession.username, 2);
    // Delete the old entry in the session map 
    deleteSession(authenticatedSession.sessionId);
    
    // Set the session cookie to the new id we generated, with a
    // renewed expiration time
    response.cookie("sessionId", newSessionId, { expires: getSession(newSessionId).expiresAt, httpOnly: true })
    return newSessionId;
}

router.get('/logout', logoutUser);
/**
 * Logouts the current user
 * 
 * @param {object} request request object that contains the cookie information
 * @param {object} response response object that has erased the cookie
 */
function logoutUser(request, response) {
    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
        response.sendStatus(401); // Unauthorized access
        return;
    }
    deleteSession(authenticatedSession.sessionId)
    console.log("Logged out user " + authenticatedSession.userSession.username);
    
    // "erase" cookie by forcing it to expire.
    response.cookie("sessionId", "", { expires: new Date() , httpOnly: true}); 
    response.sendStatus(200);
};

router.get("/auth", authUser);
function authUser(request, response) {
  try {
    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
      response.sendStatus(401);
    } else {
      response.sendStatus(200);
    }
  } catch (error) {
    response.sendStatus(401);
  }
}
    
    
module.exports = { router, routeRoot, loginUser, authenticateUser, refreshSession};