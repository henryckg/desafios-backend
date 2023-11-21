class ProductManager {
    constructor() {
        this.products = [];
    }

    static id = 0;

    #getProductByCode(productCode) {
        return this.products.find(prod => prod.code === productCode)
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Para agregar un producto nuevo, todos los campos OBLIGATORIOS")
        } else {
            const productInArr = this.#getProductByCode(code)

            if (!productInArr) {
                ProductManager.id++
                const product = {
                    id: ProductManager.id,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.products.push(product)
            } else {
                console.log(`ERROR: The code "${code}" already exists`)
            }
        }
    }

    getProducts() {
        console.log(this.products);
    }

    getProductById(productId) {
        const product = this.products.find(prod => prod.id === productId)
        if(product){
            console.log(product)
        } else {
            console.log("ERROR: Product Not Found")
        }
    }
}

const productManager = new ProductManager()

productManager.getProducts()

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)
productManager.getProducts()

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)

productManager.getProductById(2)
