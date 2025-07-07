const {constants} = require('../constants.js');
const errorHandler = (err, req, res, next) => {
//—Declares a middleware function with Express’s 
//The very presence of the fourth arg (next) tells Express, “This guy handles errors.”

    const statusCode = res.statusCode ? res.statusCode : constants.VALIDATION_ERROR; 
//Grabs whatever HTTP status may already be lurking on res 
//If nothing’s there, it defaults—some say overconfidently—to 500 Internal Server Error.
    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title: 'Validation Error',
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title: 'Not Found',
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                title: 'Forbidden',
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                title: 'Unauthorized',
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        default:
           console.error('An unexpected error occurred:', err);
            break;
    }
    console.error(err); // Log the error for debugging
    next(); // Call the next middleware in the stack    
};

module.exports = errorHandler;
