import { messageModel } from "../models/messages.model.js";

export default class MessagesMongo {
    async getMessages(){
        try {
            const messages = await messageModel.find().lean()
            return messages
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async saveMessage(msg){
        try {
            const message = await messageModel.create(msg)
            return message
        } catch (error) {
            console.log(error)
            return null
        }
    }
}