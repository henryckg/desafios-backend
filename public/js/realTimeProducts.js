const socket = io()

const productCard = document.querySelector("#productsContainer")

socket.on('server:getProducts', data => {
    let products = ''
    data.forEach(product => {
        if (product.available) {
            products += `
                <div>
                    <h2>${product.title}</h2>
                    <div>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <p>Stock: ${product.stock}</p>
                        <p>Category: ${product.category}</p>
                        <p>Code: ${product.code}</p>
                    </div>
                    <br />
                </div>
            `
        }
    });

    productCard.innerHTML = products
})

const addProductForm = document.querySelector('#addProductForm')
const description = document.querySelector('#productDescription')
const price = document.querySelector('#productPrice')
const stock = document.querySelector('#productStock')
const category = document.querySelector('#productCategory')
const code = document.querySelector('#productCode')
const title = document.querySelector('#productTitle')
const availableOptions = document.querySelectorAll('.available')

let selectedAvailableOption

availableOptions.forEach(option => {
    option.addEventListener('change', () => {
        if(option.checked){
            selectedAvailableOption = option.value === 'true'
        }
    })
})

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault()

    socket.emit('client:addProduct', {
        title: title.value,
        description: description.value,
        price: price.value,
        code: code.value,
        available: selectedAvailableOption,
        stock: stock.value,
        category: category.value,
    })

    title.value = ''
    description.value = ''
    price.value = ''
    code.value = ''
    selectedAvailableOption.value = ''
    stock.value = ''
    category.value = ''
})

const deleteProductForm = document.querySelector('#deleteProductForm')
const selectedId = document.querySelector('#selectId')

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // fetch(`http://localhost:8080/api/products/${selectedId.value}`, {
    //     method:'DELETE'
    // })

    socket.emit('client:deleteProduct', selectedId.value)
    selectedId.value = ''
})
