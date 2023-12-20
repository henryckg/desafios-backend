const socket = io()

const productCard = document.querySelector("#productCard")

socket.on('getProducts', data => {
    let products = ''
    data.forEach(product => {
        if(product.available){
            products += `
                <h2>${product.title}</h2>
                <div>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <p>Stock: ${product.stock}</p>
                    <p>Category: ${product.category}</p>
                </div>
                <br />
            `
        }
    });

    productCard.innerHTML = products
})