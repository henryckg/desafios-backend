const btns = document.querySelectorAll('.addToCartBtn')

const addToCart = async (pid) => {

    try {
        const productToCart = await fetch(`http://localhost:8080/api/carts/65a87823c3ae227084e1d4b4/product/${pid}`, {
            method: 'post'
        })
        if(productToCart.status === 200 || productToCart.status === 201){
            alert('Product added to cart')
        } else {
            alert('Could not be added to cart')
        }
    } catch (error) {
        alert('Could not be added to cart')
    }
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        addToCart(btn.id)
    })
})