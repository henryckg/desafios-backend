import { Router } from 'express';
import { cartModel } from '../dao/models/carts.model.js';
import { productModel } from '../dao/models/products.model.js';
import mongoose from 'mongoose';

const cartsRouter = Router ();

//Ruta para crear un carrito
cartsRouter.post('/', async (req, res) => {
    const cartAdded = await cartModel.create({})
    if(!cartAdded){
        return res.status(400).send({message: 'Could not create cart'})
    }
    res.status(201).send({message: 'Cart created'})
})

//Ruta para obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findOne({_id: cid}).populate('products.product')
        if(!cart){
            return res.status(404).json({message: 'Cart not found'})
        }
        res.send(cart)
    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
})

//Ruta para agregar un producto a un carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;

    try {
        const cart = await cartModel.findOne({_id: cid})
        const product = await productModel.findOne({_id: pid})

        if(!cart){
            return res.status(404).json({message: 'Cart not found'})
        }
        if(!product){
            return res.status(404).json({message: 'Product not found'})
        }

        const productInCart = cart.products.find(prod => prod.product.toString() === pid)
        if(productInCart){
            productInCart.quantity++
        } else {
            cart.products.push({product: pid, quantity: 1})
        }

        await cart.save()
        res.send({message: 'Product added to cart'})

    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

//Ruta para eliminar un producto de un carrito
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

//Ruta para actualizar un carrito
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

//Ruta para actualizar la cantidad de un producto en específico dentro de un carrito
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

//Ruta para eliminar el contenido de un carrito
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