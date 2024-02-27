import { cartModel } from "../models/carts.model.js"
import mongoose from "mongoose"

export default class CartsMongo {
    constructor(){}

    async getCart(id){
        try {
            const cart = await cartModel.findOne({_id: id}).populate('products.product')
            if(!cart){
                return false
            }
            return cart
        } catch (error) {
            throw error
        }
    }

    async createCart(){
        const result = await cartModel.create({})
        if(!result){
            return false
        }
        return result
    }

    async addProduct(cid, pid){
        try {
            const cart = await this.getCart(cid)
            if(!cart){
                return false
            }
            const productInCart = cart.products.find(prod => prod.product.equals(pid))
            if(productInCart){
                productInCart.quantity++
            } else {
                cart.products.push({product: pid, quantity: 1})
            }
            await cart.save()
            return true
        } catch (error) {
            throw error
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
            throw error
        }
    }

    async updateCart(cid, cart){
        try {
            const result = await cartModel.updateOne({_id: cid}, cart)
            return result
        } catch (error) {
            throw error
        }
    }

    async updateProductInCart(cid, pid, quantity){
        try {
            const cart = await this.getCart(cid)
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
            throw error
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
            throw error
        }
    }
}