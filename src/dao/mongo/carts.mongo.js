import { cartModel } from "../models/carts.model.js"
import mongoose from "mongoose"

export default class CartsMongo {
    constructor(){}

    async get(id){
        try {
            const cart = await cartModel.findOne({_id: id}).populate('products.product')
            return cart
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async createCart(){
        try {
            const result = await cartModel.create({})
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async addProduct(cid, pid){
        try {
            const cart = await this.get(cid)
            if(!cart) return false
            const productInCart = cart.products.find(prod => prod.product.equals(pid))
            if(productInCart){
                productInCart.quantity++
            } else {
                cart.products.push({product: pid, quantity: 1})
            }
            await cart.save()
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async deleteProductInCart(cid, pid){
        try {
            const cart = await cartModel.updateOne({_id: cid}, {
                $pull: {products : {product: new mongoose.Types.ObjectId(pid)}}
            })
            if(cart.modifiedCount > 0){
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateCart(cid, cart){
        try {
            const result = await cartModel.updateOne({_id: cid}, cart)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateProductInCart(cid, pid, quantity){
        try {
            const cart = await this.get(cid)
            if(!cart){
                return false
            }
            const prodToUpdate = cart.products.find(prod => prod.product.equals(pid))
            if(!prodToUpdate){
                return false
            }
            prodToUpdate.quantity = quantity
            await cart.save()
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async deleteContentInCart(cid){
        try {
            const cart = await cartModel.updateOne({_id: cid}, {
                products: []
            })
            if(cart.modifiedCount > 0){
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}