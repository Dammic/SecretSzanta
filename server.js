const path = require('path')
const Server = require('http').Server
const swig = require('swig')
const Express = require('express')
const expressStaticGzip = require('express-static-gzip');
const SocketEvents = require('./events/SocketEvents')

// initialize the server and configure support for ejs templates
const app = new Express()
const server = new Server(app)

// routes


// view engine setup
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

// socket.io
const io = require('socket.io')(server)

SocketEvents(io)

app.use('/', expressStaticGzip(path.join(__dirname, '/public'), {
    enableBrotli: false,
}))

// universal routing and rendering
app.get('/', (req, res) => res.render('index'))

app.use('*', (req, res, next) => {
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
