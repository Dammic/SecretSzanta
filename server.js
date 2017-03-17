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

app.use('*', (req, res, next) => {
	res.status(404)

	console.log('404! Not Found!')
    console.info('aaadsadassdajahdkja')
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
const RoomsManager = require('./utils/RoomsManager')(io.sockets.adapter)
io.on('connection', (socket) => {
    let currentPlayerName = ''
    let currentRoom = ''

    socket.on('disconnect', function() {
        io.sockets.in(currentRoom).emit('CLIENT_LEAVE_ROOM', {
            timestamp: getCurrentTimestamp(),
            author: '',
            content: `${currentPlayerName} has left the room.`
        })
        RoomsManager.removePlayer(currentRoom, currentPlayerName)
        currentRoom = ''
        currentPlayerName = ''
    })

    socket.on('CLIENT_SEND_MESSAGE', (data) => {
        const {content, author} = data
        io.sockets.in(currentRoom).emit('CLIENT_SEND_MESSAGE', {
            timestamp: getCurrentTimestamp(),
            author,
            content
        })
    })
    socket.on('CLIENT_JOIN_ROOM', (data) => {
        const {playerName, roomName} = data
        if(roomName && currentRoom === '') {
            io.sockets.in(roomName).emit('CLIENT_JOIN_ROOM', {
                timestamp: getCurrentTimestamp(),
                author: '',
                content: `${playerName} has joined the server!`
            })

            // if the room does not exist, create it
            if(!RoomsManager.isRoomAlreadyCreated(roomName)) {
                RoomsManager.initializeRoom(roomName, 10)
            }
            RoomsManager.addPlayer(roomName, playerName)

            socket.join(roomName)

            currentPlayerName = playerName
            currentRoom = roomName


        } else {
            socket.emit('CLIENT_JOIN_ROOM', {
                error: 'Error - Could not join the room!'
            })
        }
    })
})
