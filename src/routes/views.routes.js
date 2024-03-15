import { Router } from "express";
import { checkAuth, checkExistingUser, handlePolicies } from "../middlewares/auth.js";
import { productsService, cartsService } from "../repositories/index.js";

const viewRouter = Router()

viewRouter.get('/', checkAuth, async (req, res) => {
    const {user} = req.session
    const products = await productsService.getAllProducts()
    res.render('home', {user, products, title: 'WaraSound'})
})

viewRouter.get('/realtimeproducts', checkAuth, handlePolicies(['ADMIN']), (req, res) => {
    res.render('realTimeProducts', {title: 'WaraSound | Real-Time Products'})
})  

viewRouter.get('/chat', checkAuth, handlePolicies(['USER']), (req, res) => {
    res.render('chat', {title: 'WaraSound | Chat'})
})

viewRouter.get('/products', checkAuth, handlePolicies(['USER']), async (req, res) => {
    const {user} = req.session
    const { page = 1, limit = 10, sort = '', query = ''} = req.query;
    const data = await productsService.getProducts(limit, sort, page, query)
    if(page <= data.totalPages && page > 0){
        data.validPage = true
    }
    res.render('products', {data, title: 'WaraSound | Products', user})
})

viewRouter.get('/carts/:cid', checkAuth, handlePolicies(['USER']), async (req, res) => {
    const {cid} = req.params
    const cart = await cartsService.getCart(cid)
    res.render('cart', {cart, title: 'WaraSound | Cart'})
})

viewRouter.get('/login', checkExistingUser, (req, res) => {
    res.render('login', {title: 'WaraSound | Login'})
})

viewRouter.get('/register', checkExistingUser, (req, res) => {
    res.render('register', {title: 'WaraSound | Register'})
})

viewRouter.get('/restore-password', checkExistingUser, (req, res) => {
    res.render('restore-password', {title: 'WaraSound | Restore Password'})
})

viewRouter.get('/failregister', checkExistingUser, (req, res) => {
    res.render('failregister', {title: 'WaraSound | Fail Register'})
})

viewRouter.get('/faillogin', checkExistingUser, (req, res) => {
    res.render('faillogin', {title: 'WaraSound | Fail Login'})
})

export default viewRouter