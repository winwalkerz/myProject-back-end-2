
const Users = require('./../../models/users')
const Utils = require('./../../utils')

class UsersController{

    constructor(){

    }

    async createUser(req, res){
        try {

            let input = req.body
            input.email = input.email || ""
            input.name = input.name || ""

            if(!new Utils().validateEmail(input.email)){
                throw new Error("Invalid email.")
            }

            if(!input.name){
                throw new Error("Require name.")
            }

            if(!input.password){
                throw new Error("Require password.")
            }

            let password = new Utils().encryptPassword(input.password)
            
            // check 
            let user = await Users.where('email', input.email).fetch()
            if(user){
                throw new Error("มีผู้ใช้งานนี้แล้ว.")
            }

            await new Users({
                email: input.email,
                name: input.name,
                password: password
            }).save()

            res.status(200).json({
                message: "complete"
            })

        }catch(err){
            res.status(400).json({
                message: err.message
            })
        }
    }    

}

module.exports = UsersController
