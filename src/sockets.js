import ProductsMongo from "./dao/mongo/products.mongo.js"
import MessagesMongo from "./dao/mongo/messages.mongo.js"

const productsService = new ProductsMongo()
const messagesService = new MessagesMongo()

export default (io) => {
    io.on('connect', async (socket) => {
        console.log("cliente conectado")
        const products = await productsService.getAllProducts()
        io.emit('server:getProducts', products)
    
        socket.on('client:addProduct', async (data) => {
            try {
                await productsService.createProduct(data)
                const updatedProducts = await productsService.getAllProducts()
                socket.emit('server:getProducts', updatedProducts)
            } catch (error) {
                console.error(error)
            }
        })
    
        socket.on('client:deleteProduct', async (data) => {
            try {
                await productsService.deleteProduct(data)
                const updatedProducts = await productsService.getAllProducts()
                socket.emit('server:getProducts', updatedProducts)
            } catch (error) {
                console.error(error.message)
            }
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
