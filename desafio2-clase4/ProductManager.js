const fs = require("fs")

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const {title, description, price, thumbnail, code, stock} = product

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return console.log("Para agregar un producto nuevo, todos los campos son OBLIGATORIOS")
        }
        
        const products = await this.getProducts();
        const productInArr = products.find(prod => prod.code === code)

        if (!productInArr) {
            const lastId = products.length > 0 ? products[products.length - 1].id : 0
            const newProduct = {
                id: lastId + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            }
            
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
            
        } else {
            console.log(`The code "${code}" already exists`)
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
        const product = products.find(prod => prod.id === productId)
        if (product) {
            console.log(product)
        } else {
            console.log("Product Not Found")
        }
    }

    async updateProduct(id, newValues) {
        const products = await this.getProducts()
        const productId = products.some(prod => prod.id === id)

        if(productId){
            const updatedProducts = products.map(prod => {
                if(prod.id === id){
                    return {
                        id,
                        ...prod,
                        ...newValues,
                    }
                }
            })
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8')
        } else {
            console.log(`ID ${id} not found`)
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const productId = products.some(prod => prod.id === id)

        if(productId){
            const newProductsList = products.filter(prod => prod.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newProductsList), 'utf-8')
        } else {
            console.log(`ID ${id} does not exist`)
        }   
    }
}

const test = async () => {
    const productManager = new ProductManager('./desafio2-clase4/Products.json')
    let data = await productManager.getProducts()
    
    const product1 = {
        title: "producto prueba",
        description: "Esto es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25   
    }

    // await productManager.addProduct(product1)

    // await productManager.getProductById(1)
    // await productManager.getProductById(2)

    const updatedProduct1 = {
        description: "Esto es un producto prueba actualizado",
        price: 450,
    }

    // await productManager.updateProduct(1, updatedProduct1)

    // await productManager.deleteProduct(2)
    // await productManager.deleteProduct(1)

    const product2 = {
        title: "producto prueba 2",
        description: "Esto es un producto prueba 2",
        price: 150,
        thumbnail: "Sin imagen",
        code: "abc1234",
        stock: 20   
    }

    const product3 = {
        title: "producto prueba 3",
        description: "Esto es un producto prueba 3",
        price: 50,
        thumbnail: "Sin imagen",
        code: "abc12345",
        stock: 15   
    }

    // await productManager.addProduct(product2)
    // await productManager.addProduct(product3)

    // await productManager.deleteProduct(1)

    const product4 = {
        title: "producto prueba 4",
        description: "Esto es un producto prueba 4",
        price: 50,
        thumbnail: "Sin imagen",
        code: "abc123456",
        stock: 15   
    }

    await productManager.addProduct(product4)

    data = await productManager.getProducts()
    console.log(data)
}

test()
