import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        default: new Date(),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})  

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)