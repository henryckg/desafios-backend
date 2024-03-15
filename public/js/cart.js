const emptyCartBtn = document.querySelector('#emptyCartBtn')
const cartContainer = document.querySelector('#cartContainer')
const buyForm = document.querySelector('#buyForm')

if(emptyCartBtn){
    emptyCartBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:8080/api/carts/65f126542bf9104b9c9197f1', {
            method: 'delete',
        })
    
        cartContainer.innerHTML = ""
        emptyCartBtn.classList.add('hidden')
        buyForm.innerHTML = ''
    })
}