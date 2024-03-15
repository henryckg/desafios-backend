class ProductDTO{
    constructor(product){
        this.title = product.title,
        this.description = product.description,
        this.thumbnail =  product.thumbnail ? product.thumbnail : [],
        this.price = product.price,
        this.code = product.code,
        this.available = true,
        this.stock = product.stock,
        this.category = product.category
    }
}

export default ProductDTO