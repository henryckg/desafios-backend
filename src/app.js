import express from 'express';
import handlebars from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io'
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewRouter from './routes/views.routes.js';
import mongoose from 'mongoose';
import { productModel } from './dao/models/products.model.js';
import { messageModel } from './dao/models/messages.model.js';
import sessionRouter from './routes/sessions.routes.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import config from './config/dotenv.config.js';

const PORT = config.PORT;
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

app.use(session({
    secret: config.sessionSecret,
    store: MongoStore.create({
        mongoUrl: config.mongoUrl
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(config.mongoUrl)

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`)
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