import { Router } from 'express';
import { getCartById, createCart, addProductToCart, deleteProductInCart, updateCart, updateProductInCart, emptyCart, purchaseCartById } from '../controllers/carts.controller.js';

const cartsRouter = Router ();

//Ruta para crear un carrito
cartsRouter.post('/', createCart)
//Ruta para obtener un carrito por ID
cartsRouter.get('/:cid', getCartById)
//Ruta para agregar un producto a un carrito
cartsRouter.post('/:cid/product/:pid', addProductToCart)
//Ruta para eliminar un producto de un carrito
cartsRouter.delete('/:cid/products/:pid', deleteProductInCart)
//Ruta para actualizar un carrito
cartsRouter.put('/:cid', updateCart)
//Ruta para actualizar la cantidad de un producto en específico dentro de un carrito
cartsRouter.put('/:cid/products/:pid', updateProductInCart)
//Ruta para eliminar el contenido de un carrito
cartsRouter.delete('/:cid', emptyCart)
//Ruta para comprar carrito
cartsRouter.post('/:cid/purchase', purchaseCartById)

export default cartsRouter