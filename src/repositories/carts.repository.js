export default class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    getCart = async(id) => {
        const result = await this.dao.get(id)
        return result
    }

    createCart = async() => {
        const result = await this.dao.createCart()
        return result
    }

    addProduct = async(cid, pid,) => {
        const result = await this.dao.addProduct(cid, pid)
        return result
    }

    deleteProductInCart = async (cid, id) => {
        const result = await this.dao.deleteProductInCart(cid, id)
        return result
    }

    updateCart = async (cid, cart) => {
        const result = await this.dao.updateCart(cid, cart)
        return result
    }

    updateProductInCart = async (cid, pid, qty) => {
        const result = await this.dao.updateProductInCart(cid, pid, qty)
        return result
    }

    deleteContentInCart = async (cid) => {
        const result = await this.dao.deleteContentInCart(cid)
        return result
    }
}