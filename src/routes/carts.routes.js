import { Router } from 'express';
import { cartModel } from '../dao/models/carts.model.js';
import { productModel } from '../dao/models/products.model.js';
import mongoose from 'mongoose';

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
        const cart = await cartModel.findOne({_id: cid}).populate('products.product')
        res.send(cart)
    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;

    try {
        const cart = await cartModel.findOne({_id: cid})
        const product = await productModel.findOne({_id: pid})

        if(!cart || !product){
            return res.status(400).json({message: 'Product can not be added to cart'})
        }

        const productInCart = cart.products.find(prod => prod.product.toString() === pid)
        if(productInCart){
            productInCart.quantity++
        } else {
            cart.products.push({product: pid, quantity: 1})
        }

        await cart.save()
        res.send({message: 'product added to cart'})

    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartModel.updateOne({_id: cid}, {
            $pull: {products : {product: new mongoose.Types.ObjectId(pid)}}
        })
        if(cart.modifiedCount > 0){
            return res.send({message: 'Product deleted'})
        } else {
            return res.status(400).send({message: 'Could not delete product'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).send({message: 'Could not delete product'})
    }
})

cartsRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const updatedCart = req.body;
    try {
        const cart = await cartModel.updateOne({_id: cid}, updatedCart)
        if(cart.modifiedCount > 0){
            res.send({message: 'Cart updated'})
        } else {
            res.status(400).send({message: 'Could not update cart'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).send({message: 'Could not update cart'})
    }
})

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const newQty = req.body.quantity

    if(!newQty){
        return res.status(400).send({message: 'Quantity is needed'})
    }

    try {
        const cart = await cartModel.findOne({_id: cid})
        if(!cart){
            return res.status(404).send({message: 'Cart not found'})
        }
        const prodToUpdate = cart.products.find(prod => prod.product.toString() === pid)
        if(!prodToUpdate){
            return res.status(404).send({message: 'Product not found'})
        }
        prodToUpdate.quantity = newQty
        await cart.save()
        res.send({message: 'Product updated'})
        
    } catch (error) {
        console.error(error)
        res.status(400).send({message: 'Could not update product'})
    }
})

cartsRouter.delete('/:cid', async(req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.updateOne({_id: cid}, {
            products: []
        })
        if(cart.modifiedCount > 0){
            res.send({message: 'Products deleted'})
        } else {
            return res.status(404).send({message: 'Could not delete products'})
        }

    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
})

export default cartsRouter