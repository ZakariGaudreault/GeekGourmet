const express = require('express');
const router = express.Router();
const routeRoot = '/';

router.all('*', sendError);

/**
 * Handles all the invalid endpoints
 * 
 * @param {object} request Client request object
 * @param {Object} response Server response thats sends 404 status
 */
function sendError(request, response) {
    response.sendStatus(404);
}

module.exports = {
    router,
    routeRoot
}
