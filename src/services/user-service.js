const {UserRepository} = require('../repositories')
const {StatusCodes } = require('http-status-codes')
const userRepository =  new UserRepository();
const AppError = require('../utils/errors/app-error')


async function create(data){
    try{
        const user = await userRepository.create(data);
        console.log(user);
        return user;
    } catch(error){      
        if(error.name == 'TypeError' ) {
            throw new AppError('Cannot create a new flight object',StatusCodes.BAD_REQUEST);
        }      
        throw new AppError("cannot fulfil the request",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    create
}