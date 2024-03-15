import { productsService } from "../repositories/index.js";
import ProductDTO from "../dtos/product.dto.js";

export const getProducts = async (req, res) => {
    const { limit, sort, page, query } = req.query; 
    const products = await productsService.getProducts(limit, sort, page, query)
    if(!products){
        return res.status(400).send({status: 'error'})
    }
    res.send({status: 'success', ...products})
}

export const getProductById = async (req, res) => {
    const { pId } = req.params
    const product = await productsService.getProductById(pId)
    if(!product){
        return res.status(404).send({status: 'error', message: 'Product not found'})
    }
    res.send(product)
}

export const postProduct = async (req, res) => {
    const newProduct = new ProductDTO(req.body);
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
    const result = await productsService.updateProduct(pId, newValues)
    if(result){
        return res.send({message: 'Product updated'})
    }
    res.status(404).json({message: 'Could not update product'})
}

export const deleteProduct = async (req, res) => {
    const { pId } = req.params
    const productDeleted = await productsService.deleteProduct(pId)
    if (productDeleted){
        return res.send({ message: 'Product deleted' })
    }
    res.status(404).json({ message: 'Could not found product to delete'})
}