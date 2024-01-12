const socket = io()

let userName;

Swal.fire({
    title: 'Ingrese su email',
    input: 'text',
    inputValidator: (value) => {
        if(!value){
            return 'Es obligatorio ingresar un email'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(value)){
            return 'Ingrese un email válido'
        }
    },
    allowOutsideClick: false
}).then(data => {
    userName = data.value;
    socket.emit('client:newUser', userName)
})

const inputData = document.querySelector('#inputData')
const outputData = document.querySelector('#outputData')

inputData.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        if(!!inputData.value.trim()){
            socket.emit('client:message', {user: userName, message: inputData.value})
        }
        inputData.value = ''
    }
})

socket.on('server:messagesLogs', (data) => {
    let messages = '';
    data.forEach(msg => {
        messages += `${msg.user} dice: ${msg.message} <br />`
    })

    outputData.innerHTML = messages
})

socket.on('server:notification', data => {
    Swal.fire({
        text: `${data} se conectó al chat`,
        toast: true,
        position: 'top-right'
    })
})