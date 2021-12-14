const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }
        socket.join(user.room);
        socket.emit('message', generateMessage("admin", 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage("admin", `${user.username} has joined the chatroom :)`))
    })


    socket.on('sendMessage', (message, callback) => {
        const User = getUser(socket.id)
        io.to(User.room).emit('message', generateMessage(User.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const User = getUser(socket.id)
        io.to(User.room).emit('locationMessage', generateLocationMessage(User.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage("admin", `${user.username} has left the chatroom`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})