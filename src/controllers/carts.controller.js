import { cartsService, productsService, ticketsService } from "../repositories/index.js";
import { generateCode } from "../utils/codeGenerator.js";
import { sendMail } from "../utils/nodemailer.js";

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsService.getCart(cid)
    if(!cart){
        return res.status(404).json({message: 'Cart not found'})
    }
    res.send(cart)
}

export const createCart = async (req, res) => {
    const newCart = await cartsService.createCart()
    if(!newCart){
        return res.status(400).send({message: 'Could not create cart'})
    }
    res.status(201).send({message: 'Cart created', payload: newCart})
}

export const addProductToCart = async (req, res) => {
    const {cid, pid} = req.params;
    const product = await productsService.getProductById(pid)
    if(!product){
        return res.status(404).json({message: 'Product not found'})
    }
    const productAdded = await cartsService.addProduct(cid, pid)
    if(!productAdded){
        return res.status(404).json({message: 'Cart not found'})
    }
    res.send({message: 'Product added to cart'})
}

export const deleteProductInCart = async (req, res) => {
    const {cid, pid} = req.params;
    const result = await cartsService.deleteProductInCart(cid, pid)
    if(!result){
        return res.status(400).send({message: 'Could not delete product'})
    }
    res.send({message: 'Product deleted'})
}

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const updatedCart = req.body;
    const cart = await cartsService.updateCart(cid, updatedCart)
    if(cart.modifiedCount > 0){
        res.send({message: 'Cart updated'})
    } else {
        res.status(400).send({message: 'Could not update cart'})
    }
}

export const updateProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const newQty = req.body.quantity
    if(!newQty){
        return res.status(400).send({message: 'Quantity is needed'})
    }
    const result = await cartsService.updateProductInCart(cid, pid, newQty)
    if(!result){
        return res.status(400).send({message: 'Could not update product'})
    }
    res.send({message: 'Product updated'})
}

export const emptyCart = async (req, res) => {
    const { cid } = req.params;
    const result = await cartsService.deleteContentInCart(cid)
    if(!result){
        return res.status(404).send({message: 'Could not delete products'})
    }
    res.send({message: 'Products deleted'})
}

export const purchaseCartById = async (req, res) => {
    const {cid} = req.params
    const cart = await cartsService.getCart(cid)
    if(!cart){
        return res.status(404).json({message: 'Cart not found'})
    }
    let totalAmount = 0
    let noStockProducts = []
    if(!cart){
        return res.status(404).json({message: 'Cart not found'})
    }
    const productsInCart = cart.products.map(async prod => {
        const product = prod.product;
        const qty = prod.quantity;
        const id = product._id;
        const stock = product.stock;
        const price = product.price;

        if(qty <= stock){
            const updatedItem = await productsService.updateProduct(id, {stock: stock - qty})
            if(updatedItem){
                totalAmount += (price*qty)
            }
        } else {
            noStockProducts.push({product:id, quantity: qty})
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

    if(!ticket){
        return res.status(400).send({status: 'error', message: 'Something went wrong'})
    }

    if(noStockProducts.length > 0){
        //Se actualiza el carrito para que quede con productos sin stock suficiente
        await cartsService.updateCart(cid, {products: noStockProducts}) 
        return res.send({message: 'Some products could not be purchased', products: noStockProducts})
    } else {
        cartsService.deleteContentInCart(cid) //Se vacía el carrito
        sendMail(ticket.purchaser, ticket.code) //Generamos mail con el ticket.
        return res.send(ticket)
    }
}