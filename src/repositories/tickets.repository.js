export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    getTicket = async (id) => {
        const result = await this.dao.getTicket(id)
        return result
    }

    createTicket = async (ticket) => {
        const result = await this.dao.createTicket(ticket)
        return result
    }
}
