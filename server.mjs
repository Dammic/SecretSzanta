import path from 'path'
import http from 'http'
import Express from 'express'
import expressStaticGzip from 'express-static-gzip'
import SocketEvents from './events/SocketEvents'
import SocketIO from 'socket.io'

// initialize the server and configure support for ejs templates
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const app = new Express()
const server = new http.Server(app)

// routes


// view engine setup
app.set('views', path.join(__dirname, 'views'))
// socket.io
const io = SocketIO(server)

SocketEvents(io)

app.get('/', (req, res) => {
    return res.sendFile('index.html', { root: `${__dirname}/views` })
})

app.use(expressStaticGzip(path.join(__dirname, '/public'), {
    enableBrotli: true,
}))

// universal routing and rendering
app.get('*', (req, res, next) => {
    res.status(404)
    console.log(`404! Page not found! Original url: ${req.originalUrl}`)
    return res.sendFile('index.html', { root: `${__dirname}/views` })
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
