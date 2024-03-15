const btns = document.querySelectorAll('.addToCartBtn')
const logOutBtn = document.querySelector('#logOutBtn')

const addToCart = async (pid) => {

    try {
        const productToCart = await fetch(`http://localhost:8080/api/carts/65f126542bf9104b9c9197f1/product/${pid}`, {
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

logOutBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:8080/api/sessions/logout', {
        method: 'post',
        headers: {
            'Conten-Type': 'application/json'
        }
    })
    const {redirect} = await response.json()
    window.location.href = redirect
})