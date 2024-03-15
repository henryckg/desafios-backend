export const createProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid
    List of required properties:
        title: is required and needs to be a String, received ${typeof product.title}
        description: is required and needs to be a String, received ${typeof product.description}
        price: is required and needs to be a Number, received ${typeof product.price}
        stock: is required and needs to be a Number, received ${typeof product.stock}
        category: is required and needs to be a String, received ${product.category}.
        code: must be UNIQUE, is required and needs to be a String, received ${typeof product.code}
        `;
}