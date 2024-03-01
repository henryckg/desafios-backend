import express from 'express';
import handlebars from 'express-handlebars'
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io'
import productsRouter from './routes/products.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewRouter from './routes/views.routes.js';
import Sockets from './sockets.js';
import initializePassport from './config/passport.config.js';
import {getVariables} from './config/dotenv.config.js';

const {PORT, mongoUrl, secretKey} = getVariables()
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
    secret: secretKey,
    store: MongoStore.create({
        mongoUrl: mongoUrl
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(mongoUrl)

app.use('/', viewRouter)
app.use('/api/products', productsRouter)    
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`)
})

const io = new Server(httpServer);
Sockets(io)