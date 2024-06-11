const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const {UserService} = require('../services')

function validateAuthRequest(req,res,next){
    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong while authenticating user ';
        ErrorResponse.error = {explanation : 'Email not found in the incoming request'}
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    if(!req.body.password){
        ErrorResponse.message = 'Something went wrong while authenticating user ';
        ErrorResponse.error = {explanation : 'password not found in the incoming request'}
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req,res,next){
    try{
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){
            req.user = response;
            next();
        }
    }
    catch(error){
        return res
                .status(error.statusCode)
                .json(error)
    }
    
}

module.exports = {
    validateAuthRequest,
    checkAuth
}
