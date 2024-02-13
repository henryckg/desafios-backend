import mongoose from "mongoose";

const messageCollection = 'messages'

const messageSchema = mongoose.Schema({
    user: {
        type: String,
    },
    message: {
        type: String,
    }
})

export const messageModel = mongoose.model(messageCollection, messageSchema)