import { productsService } from "../repositories/index.js";
import ProductDTO from "../dtos/product.dto.js";
import CustomErrors from "../services/errors/CustomError.js";
import { createProductErrorInfo } from "../services/errors/info.js";
import ErrorEnum from "../services/errors/error.enum.js";


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

export const postProduct = async (req, res, next) => {
    try {
        const products = await productsService.getAllProducts()
        const {title, price, description, code, stock, category} = req.body;
        if(
            (!title || !price || !description || !code || !stock || !category) || 
            products.find(p => p.code === code)
        ){
            CustomErrors.createError({
                name: 'Product creation fails',
                cause: createProductErrorInfo(req.body),
                message: 'Error tryng to create user',
                code: ErrorEnum.INVALID_TYPE_ERROR 
            })
        }

        const newProduct = new ProductDTO(req.body);
        const result = await productsService.createProduct(newProduct)
        if(result) res.status(201).json({message: 'Product created'})
    } catch (error) {
        next(error)
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