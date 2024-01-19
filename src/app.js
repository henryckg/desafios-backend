import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewRouter from './routes/views.routes.js';
import mongoose from 'mongoose';
import { productModel } from './dao/models/products.model.js';
import { messageModel } from './dao/models/messages.model.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const hdb = handlebars.create({
    runtimeOptions:{
        allowProtoPropertiesByDefault: true
    }
})
app.engine('handlebars', hdb.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars')

mongoose.connect('mongodb+srv://henryckg:london.08@coder.u9wbflq.mongodb.net/ecommerce')

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

const io = new Server(httpServer);

io.on('connect', async (socket) => {
    console.log("cliente conectado")
    const products = await productModel.find()
    io.emit('getProducts', products)

    socket.on('addProduct', async (data) => {
        try {
            await productModel.create(data)
            const updatedProducts = await productModel.find()
            socket.emit('getProducts', updatedProducts)
        } catch (error) {
            console.error(error)
        }
    })

    socket.on('deleteProduct', async (data) => {
        try {
            await productModel.deleteOne({_id: data})
            const updatedProducts = await productModel.find()
            socket.emit('getProducts', updatedProducts)
        } catch (error) {
            console.error(error.message)
        }
    })

    socket.on('client:message', async (data) => {
        await messageModel.create(data);
        const messagesLogs = await messageModel.find()
        io.emit('server:messagesLogs', messagesLogs)
    })

    socket.on('client:newUser', async (data) => {
        socket.broadcast.emit('server:notification', data)
        const messagesLogs = await messageModel.find()
        socket.emit('server:messagesLogs', messagesLogs)
    })
})