import { Router } from 'express';
import { deleteProduct, getProductById, getProducts, postProduct, putProduct } from '../controllers/products.controller.js';
import { handlePolicies } from '../middlewares/auth.js';

const productsRouter = Router();

//Obtener todos los productos
productsRouter.get('/', getProducts)
//Obtener un producto por ID
productsRouter.get('/:pId', getProductById)
//Ruta para crear productos
productsRouter.post('/', handlePolicies(['ADMIN']),postProduct)
//Ruta para actualizar un producto por ID
productsRouter.put('/:pId', handlePolicies(['ADMIN']), putProduct)
//Ruta para eliminar un producto por ID
productsRouter.delete('/:pId', handlePolicies(['ADMIN']), deleteProduct)

export default productsRouter