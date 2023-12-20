import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewRouter from './routes/views.routes.js';
import axios from 'axios';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars')

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

const io = new Server(httpServer)

io.on('connect', async (socket) => {
    console.log("cliente conectado")
    const {data : products} = await axios.get('http://localhost:8080/api/products')
    io.emit('getProducts', products)
})