import { Router } from 'express';
import { deleteProduct, getProduct, getAllProducts, postProduct, putProduct } from '../controllers/products.controller.js';

const productsRouter = Router();

//Obtener todos los productos
productsRouter.get('/', getAllProducts)
//Obtener un producto por ID
productsRouter.get('/:pId', getProduct)
//Ruta para crear productos
productsRouter.post('/', postProduct)
//Ruta para actualizar un producto por ID
productsRouter.put('/:pId', putProduct)
//Ruta para eliminar un producto por ID
productsRouter.delete('/:pId', deleteProduct)

export default productsRouter