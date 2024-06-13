const {UserRepository,RoleRepository} = require('../repositories')
const {StatusCodes } = require('http-status-codes')
const userRepository =  new UserRepository();
const AppError = require('../utils/errors/app-error')
const roleRepository = new RoleRepository();

const {Auth,Enums} = require('../utils/common')

async function create(data){
    try{
        const user = await userRepository.create(data);
        console.log(user);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER)
        user.addRole(role);  
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

async function addRoletoUser(data){
    try{
        const user  = await userRepository.get(data.userId)
        if(!user){
            throw new AppError('no user found for the given id',StatusCodes.NOT_FOUND)
        }
        const role = await roleRepository.getRoleByName(data.role)
        if(!role){
            throw new AppError('no user found for the given role',StatusCodes.NOT_FOUND)
        }
        user.addRole(role);
        return user;
    }catch(error){
            if(error instanceof AppError) throw error;
            console.log(error)   
            throw new AppError('something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
}
}

async function isAdmin(id){
    try{
        const user  = await userRepository.get(id);
        if(!user){
            throw new AppError('no user found for the given id',StatusCodes.NOT_FOUND)
        }

        const adminRole = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminRole){
            throw new AppError('no user found for the given role',StatusCodes.NOT_FOUND)
        }
        return user.hasRole(adminRole);

    }catch(error){
        if(error instanceof AppError) throw error;
        console.log(error)   
        throw new AppError('something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
    
}





module.exports={
    create,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin
}