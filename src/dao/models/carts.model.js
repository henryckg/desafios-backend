import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true,
                    ref: 'products'
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