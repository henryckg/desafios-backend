import { Router } from 'express';
import { uploader } from '../utils/multer.js';
import { productModel } from '../dao/models/products.model.js';

const productsRouter = Router();

//Ruta para obtener productos con filtros y paginación
productsRouter.get('/', async (req, res) => {
    const { limit = 10, sort = '', page = 1, query = '' } = req.query;
    const [code, value] = query.split(':')
    
    const products = await productModel.paginate({[code] : value}, {
        limit,
        page,
        sort : sort ? {price : sort} : {}
    })
    products.payload = products.docs
    delete products.docs

    if(!products){
        return res.status(400).send({status: 'error'})
    }

    res.send({status: 'success', ...products})
})

//Ruta para obtener un producto por ID
productsRouter.get('/:pId', async (req, res) => {
    const {pId} = req.params

    try {
        const product = await productModel.findOne({_id: pId})
        if(!product){
            return res.status(404).send({status: 'error', message: 'Product not found'})
        }
        res.send(product)
    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
})

//Ruta para crear productos
productsRouter.post('/', uploader.array('files'), async (req, res) => {
    const newProduct = req.body;

    ///// Multer será integrado más tarde /////
    // const files = req.files
    // let paths = []

    // files.forEach((file) => {
    //     paths.push(file.path.split('public').join(''))
    // })

    try {
        await productModel.create(newProduct)
        res.status(201).json({message: 'Product created'})
    } catch (error) {
        console.error({error})
        if(error.code === 11000){
            return res.status(400).json({message: 'Code already exists'})
        }
        if(error.errors){
            return res.status(400).json({message: error.message})
        }
        res.status(400).json({error})
    }
})

//Ruta para actualizar un producto por ID
productsRouter.put('/:pId', async (req, res) => {
    const { pId } = req.params
    const newValues = req.body

    try {
        const update = await productModel.updateOne({_id: pId}, newValues)
        if (update.matchedCount > 0) {
            return res.send({message: 'product updated'})
        }
        res.status(404).json({message: 'product not found'})
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

//Ruta para eliminar un producto por ID
productsRouter.delete('/:pId', async (req, res) => {
    const { pId } = req.params

    try {
        const productDeleted = await productModel.deleteOne({ _id: pId })
        if (productDeleted.deletedCount > 0) {
            return res.send({ message: 'Product deleted' })
        }
        res.status(404).json({ message: 'Product not found' })
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

export default productsRouter