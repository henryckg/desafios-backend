import ProductsMongo from "../dao/mongo/products.mongo.js";

const productsService = new ProductsMongo()

export const getAllProducts = async (req, res) => {
    const { limit = 10, sort = '', page = 1, query = '' } = req.query; 
    const [code, value] = query.split(':')
    const products = await productsService.getProducts(limit, sort, page, code, value)
    if(!products){
        return res.status(400).send({status: 'error'})
    }
    res.send({status: 'success', ...products})
}

export const getProduct = async (req, res) => {
    const { pId } = req.params
    try {
        const product = await productsService.getProductById(pId)
        if(!product){
            return res.status(404).send({status: 'error', message: 'Product not found'})
        }
        res.send(product)
    } catch (error) {
        console.error(error)
        res.status(404).send({error})
    }
}

export const postProduct = async (req, res) => {
    const newProduct = req.body;
    ///// Multer será integrado más tarde /////
    // const files = req.files
    // let paths = []

    // files.forEach((file) => {
    //     paths.push(file.path.split('public').join(''))
    // })
    try {  
        const result = await productsService.createProduct(newProduct)
        if(result) res.status(201).json({message: 'Product created'})
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
}

export const putProduct = async (req, res) => {
    const { pId } = req.params
    const newValues = req.body
    try {
        const result = await productsService.updateProduct(pId, newValues)
        if (result.matchedCount > 0) {
            return res.send({message: 'product updated'})
        }
        res.status(404).json({message: 'product not found'})
    } catch (error) {
        console.error(error)    
        res.status(400).send({error})
    }
}

export const deleteProduct = async (req, res) => {
    const { pId } = req.params
    try {
        const productDeleted = await productsService.deleteProduct(pId)
        if (productDeleted.deletedCount > 0) {
            return res.send({ message: 'Product deleted' })
        }
        res.status(404).json({ message: 'Product not found' })
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
}