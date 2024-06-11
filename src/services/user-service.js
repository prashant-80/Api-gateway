const {UserRepository} = require('../repositories')
const {StatusCodes } = require('http-status-codes')
const userRepository =  new UserRepository();
const AppError = require('../utils/errors/app-error')

const {Auth} = require('../utils/common')

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

async function signin(data){
    try{
        const user  = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('no user found for the given email',StatusCodes.NOT_FOUND)
        }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id:user.id,email:user.email});
        return jwt
    }catch(error){
        if(error instanceof AppError) throw error;
        console.log(error)   
        throw new AppError('something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAuthenticated(token){
    try{
        if(!token){
            throw new AppError('missing jwt token',StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError('No user find,StatusCodes.BAD_REQUEST');
        }
        return user.id;
    }catch(error){
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid jwt token',StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw error;
    }
}





module.exports={
    create,
    signin,
    isAuthenticated
}