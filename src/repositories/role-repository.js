const CrudRepository = require('./crud-repository')
const { Role } = require('../models')

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role)
    }

    async getRoleByName(name){
        console.log('inside rolerequir')
        const role  = await Role.findOne({where:{name:name}});
        console.log('inside rolerequir')
        return role;
    }
}


module.exports = RoleRepository