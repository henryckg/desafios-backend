import { ticketModel } from "../models/tickets.model.js";

export default class TicketMongo {
    async getTicket(id){
        try {
            const ticket = await ticketModel.findOne({_id: id}).lean()
            if(!ticket){
                return false
            }
            return ticket
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async createTicket(ticket){
        try {
            const result = await ticketModel.create(ticket)
            return result
        } catch (error) {
            throw error
        }
    }
}