import path from 'path'
import http from 'http'
import Express from 'express'
import ejs from 'ejs'
import expressStaticGzip from 'express-static-gzip'
import { initializeIO } from './io'

// initialize the server and configure support for ejs templates
const __dirname = path.resolve('.') //new URL(import.meta.url).pathname)
const distDirName = path.join(__dirname, '.dist')
const app = new Express()
const server = new http.Server(app)

// view engine setup
app.set('views', distDirName)

// socket.io
initializeIO(server)

app.get('/', (req, res) => {
    console.log(distDirName)
    return res.sendFile('index.html', { root: distDirName })
})

app.use(expressStaticGzip(distDirName))

// universal routing and rendering
app.get('*', (req, res, next) => {
    res.status(404)
    console.log(`404! Page not found! Original url: ${req.originalUrl}`)
    return res.sendFile('index', { root: distDirName })
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
