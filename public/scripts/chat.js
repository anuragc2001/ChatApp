const socket = io()
const p = document.querySelector('p')
const form = document.querySelector('form')
const button = document.querySelector('button')

socket.on('onWelcome', (message) => {
    p.innerHTML = message
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.querySelector('input').value
    socket.emit('newMessage', input)
})

