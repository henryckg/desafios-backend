import { Router } from 'express';
import CartManager from '../CartManager.js';

const cartRouter = Router ();

const cartManager = new CartManager('src/Carts.json');

cartRouter.post('/', async (req, res) => {
    const cartAdded = await cartManager.createCart()
    if(!cartAdded){
        return res.status(400).send({message: error.message})
    }
    res.send({message: 'cart created'})
})

cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(+cid)
        res.send(cart)
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;

    try {
        await cartManager.addProductToCart(+pid, +cid)
        res.send({message: 'product added'})
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

export default cartRouter