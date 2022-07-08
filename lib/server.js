/**
 * HTTP Server file to run the application server
 */

// Dependencies
const express = require('express');
const router = require('./router');

const app = express();
const port = 3000;

const winston = require('winston');
const expressWinston = require('express-winston');

// ------------------------------------------------------- //

// create module to export
let _ = {};


// Load the server
_.start = async (secrets) => {

    try {

        // Start the app server
        app.listen(port);

        // Log the status of the server
        console.log('Application listening on port: ' + port);

        // Log the secret data received
        // console.log("Here are the secrets", secrets);

        return true
    } catch (err) {

        throw( new Error(err));
    }
    
};

// Middlewares

// Set the app logger - Winston & Express-Winston
// app.use(expressWinston.logger({
//     'transports' : [
//         new winston.transports.Console()
//     ]
// }));

// Parse all request as JSON. Use json middleware
app.use(express.json());

// Set the app router (Meaning: App should use 'router' for all of the paths)
app.use('/', router);


// Export App Server module as _ to run in index.js entry point
module.exports = _;