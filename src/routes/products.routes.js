import { Router } from 'express';
import ProductManager from '../ProductManager.js'


const productsRouter = Router();

const productManager = new ProductManager('./src/Products.json')

productsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    const { limit } = req.query;
    if(!limit){
        return res.send(products)
    } 
    const limitedProducts = products.slice(0, +limit)
    res.send(limitedProducts)
})

productsRouter.get('/:pid', async (req, res) => {
    const {pid} = req.params

    try {
        const product = await productManager.getProductById(+pid)
        res.send(product)
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

productsRouter.post('/', async (req, res) => {
    const product = req.body;
    
    try {
        await productManager.addProduct(product)
        res.send({message: 'product added'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})

productsRouter.put('/:pid', async (req, res) => {
    const {pid} = req.params

    try {
        const newValues = req.body
        await productManager.updateProduct(+pid, newValues)
        res.send({message: 'product has been updated'})
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const {pid} = req.params

    try {
        await productManager.deleteProduct(+pid)
        res.send({message: 'product deleted'})
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

export default productsRouter