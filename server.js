'use strict'
const path = require('path')
const Server = require('http').Server
const swig = require('swig')
const Express = require('express')
const SocketEvents = require('./events/SocketEvents')
const roomsRoute = require('./routes/rooms')
const RoomsManager = require('./utils/RoomsManager')

// initialize the server and configure support for ejs templates
const app = new Express()
const server = new Server(app)

// routes


// view engine setup
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))
app.use(Express.static(__dirname + '/public'))

// socket.io
const io = require('socket.io')(server)
const RoomsManagerInstance = new RoomsManager()

SocketEvents(io, RoomsManagerInstance)

// universal routing and rendering
app.get('/', (req, res) => res.render('index'))
app.use('/rooms', roomsRoute(RoomsManagerInstance))

app.use('*', (req, res, next) => {
    res.status(404)

    console.log('404! Not Found!')
    console.log('original url:', req.originalUrl)
    return res.render('index')
})

// start the server
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'production'
server.listen(port, err => {
    if (err) {
        return console.error(err)
    }
    console.info(`Server running on http://localhost:${port} [${env}]`)
})
