import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";

const viewRouter = Router()

viewRouter.get('/', checkAuth, async (req, res) => {
    const {user} = req.session
    try {
        const products = await productModel.find().lean()
        res.render('home', {user, products, title: 'WaraSound'})
    } catch (error) {
        res.render('error', {error: 400, message: "400 Bad Request"})
    }
})

viewRouter.get('/realtimeproducts', checkAuth, (req, res) => {
    res.render('realTimeProducts', {title: 'WaraSound | Real-Time Products'})
})  

viewRouter.get('/chat', checkAuth, (req, res) =>     {
    res.render('chat', {title: 'WaraSound | Chat'})
})

viewRouter.get('/products', checkAuth, async (req, res) => {

    const {user} = req.session
    const {page = 1, limit = 10, sort = '', query = ''} = req.query
    const [code, value] = query.split(':')
    const data = await productModel.paginate({[code]:value}, {
        limit,
        page,
        sort: sort ? {price : sort} : {}
    })
    
    if(page <= data.totalPages && page > 0){
        data.validPage = true
    }
    res.render('products', {data, title: 'WaraSound | Products', user})
})

viewRouter.get('/carts/:cid', checkAuth, async (req, res) => {
    const {cid} = req.params
    const cart = await cartModel.findOne({_id: cid}).populate('products.product')
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