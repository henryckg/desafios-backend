export default class MessageRepository{
    constructor(dao){
        this.dao = dao
    }

    getMessages = async () => {
        const result = await this.dao.getMessages()
        return result
    }

    saveMessage = async(msg) => {
        const result = await this.dao.saveMessage(msg)
        return result
    }
}