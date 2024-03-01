import { userModel } from "../models/user.model.js"

export default class UsersMongo {

    async getUserByEmail(email){
        try{
            const user = await userModel.findOne({email})
            return user
        } catch(error) {
            console.log(error)
            return null
        }
    }

    async getUserById(id){
        try {
            const user = await userModel.findOne({_id: id})
            return user
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async saveUser(user){
        try {
            const result = await userModel.create(user)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}