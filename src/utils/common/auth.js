const bcrypt = require('bcrypt');
const {ServerConfig} = require('../../config')
const jwt  = require('jsonwebtoken')

 function checkPassword(plainPassword,encryptedPassword){
    try{
        return bcrypt.compareSync(plainPassword,encryptedPassword)
    }catch(error){
        console.log(error);
        throw error;
    }
}

function createToken(input){
    try{
        return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY});
    }catch(error){
        console.log(error);
        throw error
    }
}

function verifyToken(token){
    try{
        return jwt.verify(token,ServerConfig.JWT_SECRET);
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports={
    checkPassword,
    createToken,
    verifyToken
}
