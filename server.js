const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const generateMsg = require('./utils/messages')
const { userJoin,userLeave,getCurrentUser,getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = new socketio.Server(server)

//set static folder
app.use(express.static(path.join(__dirname,'public')))


//run when any client connects
io.on('connection', (socket) => {
    //listening  join room event
    socket.on('joinroom',({ username,room }) => {
        //Adding user to room
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        
        //welcome current user
        socket.emit('message',generateMsg('Admin','Welcome to ChatCord'))
        
        //broadcast message when a new client connects
        socket.broadcast.to(user.room).emit('message',generateMsg('Admin',`${user.username} has joined the chat`))

        //sending user and room info to client
        io.to(user.room).emit('roominfo',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

    })
    //listening the chatmessage from client and emit it
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',generateMsg(user.username,message))
    })
    
    //runs when client disconnects
    socket.on('disconnect',() => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message',generateMsg('Admin',` ${user.username} has left the chat`))
        }
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})