import axios from "axios";
import { Router } from "express";

const viewRouter = Router()

viewRouter.get('/', async (req, res) => {
    const {data : products} = await axios.get('http://localhost:8080/api/products')
    res.render('home', {products, title: 'WaraSound'})
})

viewRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {title: 'WaraSound | Real-Time Products'})
})

export default viewRouter