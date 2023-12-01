import express from 'express';
import ProductManager from './ProductManager.js'

const app = express();
const PORT = 8080;
app.use(express.urlencoded({extended: true}));

const productManager = new ProductManager("./src/Products.json")

app.get('/', (req, res) => {
    res.send('<h1>Product Manager</h1>')
})

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts()
    const { limit } = req.query;
    if(!limit){
        return res.send(products)
    } 
    const productsLimited = products.slice(0, +limit)
    res.send(productsLimited)
})

app.get('/products/:pId', async (req, res) => {
    const {pId} = req.params

    try {
        const product = await productManager.getProductById(+pId)
        res.send(product)
    } catch (error) {
        res.send({error: error.message})
    }
})

app.listen(PORT, () => {
    console.log(`Servidor funcionando desde el puerto ${PORT}`)
})