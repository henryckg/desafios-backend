import { productsService, messagesService } from "./repositories/index.js"

export default (io) => {
    io.on('connect', async (socket) => {
        console.log("cliente conectado")
        const products = await productsService.getAllProducts()
        io.emit('server:getProducts', products)
    
        socket.on('client:addProduct', async (data) => {
            await productsService.createProduct(data)
            const updatedProducts = await productsService.getAllProducts()
            socket.emit('server:getProducts', updatedProducts)
        })
    
        socket.on('client:deleteProduct', async (data) => {
            await productsService.deleteProduct(data)
            const updatedProducts = await productsService.getAllProducts()
            socket.emit('server:getProducts', updatedProducts)
        })
    
        socket.on('client:message', async (data) => {
            await messagesService.saveMessage(data);
            const messagesLogs = await messagesService.getMessages()
            io.emit('server:messagesLogs', messagesLogs)
        })
    
        socket.on('client:newUser', async (data) => {
            socket.broadcast.emit('server:notification', data)
            const messagesLogs = await messagesService.getMessages()
            socket.emit('server:messagesLogs', messagesLogs)
        })
    })
}
