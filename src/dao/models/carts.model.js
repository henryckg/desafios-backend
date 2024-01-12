import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    }
})

export const cartModel = mongoose.model(cartCollection, cartSchema)