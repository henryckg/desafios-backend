import { productModel } from "../models/products.model.js";

export class ProductMongoManager {
    constructor() {
        this.model = productModel
    }

    async getProducts(limit = 10, page = 1, sort = '', query = '') {
        const { limit = 10, sort = '', page = 1, query = '' } = req.query;
        const [code, value] = query.split(':')

        let products = await productModel.paginate({ [code]: value }, {
            limit,
            page,
            sort: sort ? { price: sort } : {}
        })
        products.payload = products.docs
        delete products.docs
    }

}