const { StatusCodes } = require('http-status-codes')
const {UserService} = require('../services')
const {ErrorResponse,SuccessResponse} = require('../utils/common')

async function signup(req, res) {
    try {
        console.log(req.body);
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || 500)
            .json(ErrorResponse);
    }
}




module.exports={
    signup
}