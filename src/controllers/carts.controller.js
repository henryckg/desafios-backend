import { cartsService, productsService, ticketsService } from "../repositories/index.js";
import CustomErrors from "../services/errors/CustomError.js";
import ErrorEnum from "../services/errors/error.enum.js";
import { createCartErrorInfo, createTicketErrorInfo, deleteProdInCartErrInfo, getCartErrorInfo, getSingleProductErrorInfo } from "../services/errors/info.js";
import { generateCode } from "../utils/codeGenerator.js";
import { sendMail } from "../utils/nodemailer.js";

export const getCartById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getCart(cid)
        if (!cart) {
            CustomErrors.createError({
                name: "Cart not found",
                cause: getCartErrorInfo(cid),
                message: "Error trying to find cart",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        res.send(cart)
    } catch (error) {
        next(error)
    }

}

export const createCart = async (req, res, next) => {
    try {
        const newCart = await cartsService.createCart()
        if (!newCart) {
            CustomErrors.createError({
                name: "Cart not created",
                cause: createCartErrorInfo(),
                message: "Error trying to create a cart",
                code: ErrorEnum.DATABASE_ERROR
            })
        }
        res.status(201).send({ message: 'Cart created', payload: newCart })
    } catch (error) {
        next(error)
    }
}

export const addProductToCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const product = await productsService.getProductById(pid)
        if (!product) {
            CustomErrors.createError({
                name: "Product not found",
                cause: getSingleProductErrorInfo(pid),
                message: "Error trying to find product",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        const productAdded = await cartsService.addProduct(cid, pid)
        if (!productAdded) {
            CustomErrors.createError({
                name: "Cart not found",
                cause: getCartErrorInfo(cid),
                message: "Error trying to find cart",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        res.send({ message: 'Product added to cart' })
    } catch (error) {
        next(error)
    }
}

export const deleteProductInCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartsService.deleteProductInCart(cid, pid)
        if (!result) {
            CustomErrors.createError({
                name: "Could not delete product",
                cause: deleteProdInCartErrInfo(cid, pid),
                message: "Error trying to delete items in cart",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        res.send({ message: 'Product deleted' })
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const updatedCart = req.body;
        const cart = await cartsService.getCart(cid)
        if (!cart) {
            CustomErrors.createError({
                name: "Cart not found",
                cause: getCartErrorInfo(cid),
                message: "Error trying to find and update cart",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        const result = await cartsService.updateCart(cid, updatedCart)
        if (result.modifiedCount > 0) {
            res.send({ message: 'Cart updated' })
        }
    } catch (error) {
        next(error)
    }
}

export const updateProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const newQty = req.body.quantity
    if (!newQty) {
        return res.status(400).send({ message: 'Quantity is needed' })
    }
    const result = await cartsService.updateProductInCart(cid, pid, newQty)
    if (!result) {
        return res.status(400).send({ message: 'Could not update product' })
    }
    res.send({ message: 'Product updated' })
}

export const emptyCart = async (req, res) => {
    const { cid } = req.params;
    const result = await cartsService.deleteContentInCart(cid)
    if (!result) {
        return res.status(404).send({ message: 'Could not delete products' })
    }
    res.send({ message: 'Products deleted' })
}

export const purchaseCartById = async (req, res, next) => {
    try {
        const { cid } = req.params
        const cart = await cartsService.getCart(cid)
        if (!cart) {
            CustomErrors.createError({
                name: "Cart not found",
                cause: getCartErrorInfo(cid),
                message: "Error trying to find cart",
                code: ErrorEnum.INVALID_ID_ERROR
            })
        }
        let totalAmount = 0
        let noStockProducts = []
        
        const productsInCart = cart.products.map(async prod => {
            const product = prod.product;
            const qty = prod.quantity;
            const id = product._id;
            const stock = product.stock;
            const price = product.price;
    
            if (qty <= stock) {
                const updatedItem = await productsService.updateProduct(id, { stock: stock - qty })
                if (updatedItem) {
                    totalAmount += (price * qty)
                }
            } else {
                noStockProducts.push({ product: id, quantity: qty })
            }
        })
    
        await Promise.all(productsInCart)
    
        //Creación de Ticket
        const ticket = await ticketsService.createTicket({
            code: generateCode(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: req.session.user.email
        })
    
        if (!ticket) {
            CustomErrors.createError({
                name: "Could not create ticket",
                cause: createTicketErrorInfo(),
                message: "Error trying to create ticket",
                code: ErrorEnum.DATABASE_ERROR
            })
        }
    
        if (noStockProducts.length > 0) {
            //Se actualiza el carrito para que quede con productos sin stock suficiente
            await cartsService.updateCart(cid, { products: noStockProducts })
            return res.send({ message: 'Some products could not be purchased', products: noStockProducts })
        } else {
            cartsService.deleteContentInCart(cid) //Se vacía el carrito
            sendMail(ticket.purchaser, ticket.code) //Generamos mail con el ticket.
            return res.send(ticket)
        }
    } catch (error) {
        next(error)
    }
}