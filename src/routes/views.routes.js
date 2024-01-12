import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";

const viewRouter = Router()

viewRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find().lean()
        res.render('home', {products, title: 'WaraSound'})
    } catch (error) {
        res.render('error', {error: 400, message: "400 Bad Request"})
    }
})

viewRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {title: 'WaraSound | Real-Time Products'})
})

viewRouter.get('/chat', (req, res) => {
    res.render('chat')
})

viewRouter.get('*', (req, res) => {
    res.render('error', {error: 404, message: "404 Not Found"})
})

export default viewRouter