import { productModel } from "../models/products.model.js";

export default class ProductsMongo {
    constructor() { }

    async getProducts(limit, sort, page, code, value) {
        const products = await productModel.paginate({ [code]: value }, {
            limit,
            page,
            sort: sort ? { price: sort } : {}
        })
        products.payload = products.docs
        delete products.docs

        if (!products) {
            return false
        }
        return ({ ...products })
    }

    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id })
            if (!product) {
                return false
            }
            return product
        } catch (error) {
            throw error
        }
    }

    async createProduct(product) {
        try {
            await productModel.create(product)
            return true
        } catch (error) {
            throw error
        }
    }

    async updateProduct(id, values){
        try {
            const update = await productModel.updateOne({_id: id}, values)
            return update
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id){
        try {
            const deleted = await productModel.deleteOne({ _id: id })
            return deleted
        } catch (error) {
            throw error
        }
    }
}