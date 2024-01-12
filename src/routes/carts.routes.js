import { Router } from 'express';
import { cartModel } from '../dao/models/carts.model.js';
import { productModel } from '../dao/models/products.model.js';

const cartsRouter = Router ();

cartsRouter.post('/', async (req, res) => {
    const cartAdded = await cartModel.create({})
    if(!cartAdded){
        return res.status(400).send({message: 'cart can not be created'})
    }
    res.send({message: 'cart created'})
})

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findOne({_id: cid})
        res.send(cart)
    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;

    try {
        const productToAdd = await productModel.findOne({_id: pid})
        const cartToUpdate = await cartModel.findOne({_id: cid})

        if(!productToAdd || !cartToUpdate){
            return res.status(400).json({message: 'product can not be added to cart'})
        }

        const allCarts = await cartModel.find()
        const index = allCarts.findIndex(i => i._id.equals(cid))

        if(index === -1){
            return res.status(404).json({message: 'cart not found'})
        }
        
        const productsInCart = allCarts[index].products
        const prodInCart = productsInCart.find(prod => prod.product === pid)

        if(prodInCart){
            const indexProd = productsInCart.findIndex(prod => prod.product === pid)
            productsInCart[indexProd].quantity++
        } else {
            const newProdInCart = {product: pid, quantity: 1}
            productsInCart.push(newProdInCart)
        }

        await cartModel.findOneAndUpdate({_id:cid}, {products: productsInCart})

        res.send({message: 'product added to cart'})

    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

export default cartsRouter