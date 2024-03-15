import fs from 'fs'
import ProductManager from './ProductManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data)
            return carts;
        } catch (error) {
            return []
        }
    }

    async getCartById(cid) {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === +cid)

        if (cart) {
            return cart
        } else {
            throw new Error('cart not found')
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts()
            const lastId = carts.length > 0 ? carts[carts.length - 1].id : 0
            carts.push({
                id: lastId + 1,
                products: []
            });
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return true
        } catch (error) {
            throw new Error("cart not created")
        }
    }

    async addProductToCart(pid, cid) {
        const productManager = new ProductManager('./json/Products.json')

        //Llamado a producto y carrito por ID para verificar si existen, de lo contrario, arrojaran error y se interrumpe el método
        const productToAdd = await productManager.getProductById(+pid)
        const cartToUpdate = await this.getCartById(+cid)

        if(cartToUpdate && productToAdd){
            const carts = await this.getCarts()
            const updatedCarts = carts.map(cart => {
                if (cart.id === +cid) {
                    const existingProd = cart.products.find(prod => prod.product === +pid)
                    if (existingProd) {
                        existingProd.quantity++
                    } else {
                        cart.products = [
                            ...cart.products,
                            { product: productToAdd.id, quantity: 1 }
                        ]
                    }
                }
                return cart
            })
            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts), 'utf-8')
        } else {
            throw new Error ("product can not be added")
        }
    }
}

export default CartManager