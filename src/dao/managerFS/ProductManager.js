import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const {title, description, price, thumbnail, code, available, stock, category} = product

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("all fields are required")
        }
        
        const products = await this.getProducts();
        const productInArr = products.find(prod => prod.code === code)

        if (!productInArr) {
            const lastId = products.length > 0 ? products[products.length - 1].id : 0
            const newProduct = {
                id: lastId + 1,
                title,
                description,
                thumbnail,
                price,
                code,
                available,
                stock,
                category
            }
            
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
            
        } else {
            throw new Error(`code ${code} already exists`)
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const parsedData = JSON.parse(data);
            return parsedData;
        } catch (error) {
            return [];
        }
    }

    async getProductById(productId) {
        const products = await this.getProducts();
        const product = products.find(prod => prod.id === +productId)
        if (product) {
            return product
        } else {
            throw new Error ('product not found')
        }
    }

    async updateProduct(id, newValues) {
        const products = await this.getProducts() 

        if(products.some(prod => prod.id === +id)){
            const updatedProducts = products.map(prod => {
                if(prod.id === +id){
                    return {
                        ...prod,
                        ...newValues,
                        id: +id
                    }
                }
                return prod
            })
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8')
        } else {
            throw new Error (`id ${id} not found`)
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const productId = products.some(prod => prod.id === +id)

        if(productId){
            const newProductsList = products.filter(prod => prod.id !== +id)
            await fs.promises.writeFile(this.path, JSON.stringify(newProductsList), 'utf-8')
        } else {
            throw new Error (`id ${id} does not exist`)
        }   
    }
}

export default ProductManager;