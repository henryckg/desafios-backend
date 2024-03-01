import { userModel } from "../models/user.model.js"

export default class UsersMongo {

    async getUserByEmail(email){
        try{
            const user = await userModel.findOne({email: email})
            if(!user){
                return false
            }
            return user
        } catch(error) {
            console.log(error)
            return false
        }
    }

    async getUserById(id){
        try {
            const user = await userModel.findOne({_id: id})
            if(!user){
                return false
            }
            return user
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async saveUser(user){
        try {
            const result = await userModel.create(user)
            if(!result){
                return false
            }
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    }
}