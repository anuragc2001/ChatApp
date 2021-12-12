const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const port = process.env.PORT || 3000

const app = new express()
const server = http.createServer(app)

const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log("New connection established :)")
    socket.emit('onWelcome', "Welcome")
    socket.on('newMessage', (message) => {
        io.emit('onWelcome', message)
    })

})

server.listen(port, () => {
    console.log("Server started at port ", port)
})