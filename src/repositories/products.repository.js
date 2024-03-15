import ProductDTO from "../dtos/product.dto.js"

export default class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    getAllProducts = async () => {
        const result = await this.dao.getAllProducts()
        return result
    }
    
    getProducts = async (limit, sort, page, query) => {
        const result = await this.dao.getProducts(limit, sort, page, query)
        return result
    }

    getProductById = async (id) => {
        const result = await this.dao.getProductById(id)
        return result
    }

    createProduct = async (product) => {
        const newProduct = new ProductDTO(product)
        const result = await this.dao.createProduct(newProduct) 
        return result
    }

    updateProduct = async (id, values) => {
        const result = await this.dao.updateProduct(id, values)
        return result
    }

    deleteProduct = async (id) => {
        const result = await this.dao.deleteProduct(id)
        return result
    }
}
