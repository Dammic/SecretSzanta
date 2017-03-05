'use strict'
const path = require('path')
const Server = require('http').Server
const swig = require('swig')
const Express = require('express')

// initialize the server and configure support for ejs templates
const app = new Express()
const server = new Server(app)

// routes


// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))
app.use(Express.static(__dirname + '/public'))


// universal routing and rendering
app.get('/', (req, res) => {
    return res.render('index')
})

// start the server
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'production'
server.listen(port, err => {
    if (err) {
        return console.error(err)
    } else {
        console.info(`Server running on http://localhost:${port} [${env}]`)
    }
})

const getCurrentTimestamp = function() {
    return Math.floor(Date.now() / 1000)
}

// socket.io
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', (data) => {
        const {content, author} = data
        io.sockets.in('ala').emit('CLIENT_SEND_MESSAGE', {
            timestamp: getCurrentTimestamp(),
            author,
            content
        })
    })
    socket.on('CLIENT_JOIN_ROOM', (data) => {
        const {playerName} = data

        // checking if the client can join a room (is currently not in any other room)
        // console.info(io.sockets.manager.roomClients[socket.id])
        io.sockets.in('ala').emit('CLIENT_JOIN_ROOM', {
            timestamp: getCurrentTimestamp(),
            author: '',
            content: `${playerName} has joined the server!`
        })
        socket.join('ala')
    })
})
