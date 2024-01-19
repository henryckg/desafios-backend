import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Recording', 'Microphones', 'Monitors', 'Headphones']
    }
})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)