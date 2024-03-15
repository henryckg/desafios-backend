export default class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    getUserByEmail = async(email) => {
        const result = await this.dao.getUserByEmail(email)
        return result
    }

    getUserById = async(id) => {
        const result = await this.dao.getUserById(id)
        return result
    }

    saveUser = async(user) => {
        const result = await this.dao.saveUser(user)
        return result
    }
}