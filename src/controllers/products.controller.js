import { productsService } from "../repositories/index.js";
import ProductDTO from "../dtos/product.dto.js";
import CustomErrors from "../services/errors/CustomError.js";
import { createProductErrorInfo, getProductsErrorInfo, getSingleProductErrorInfo } from "../services/errors/info.js";
import ErrorEnum from "../services/errors/error.enum.js";


export const getProducts = async (req, res, next) => {
    try {
        const { limit, sort, page, query } = req.query;
        const products = await productsService.getProducts(limit, sort, page, query)
        if(!products){
            CustomErrors.createError({
                name: "Cannot get products",
                cause: getProductsErrorInfo(),
                message: "Error trying to get products",
                code: ErrorEnum.DATABASE_ERROR
            })
        }
        res.send({status: 'success', ...products})
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const { pId } = req.params
        const product = await productsService.getProductById(pId)
        if(!product){
            CustomErrors.createError({
                name: "Product not found",
                cause: getSingleProductErrorInfo(pId),
                message: "Error trying to find product",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        res.send(product)
    } catch (error) {
        next(error)
    }
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