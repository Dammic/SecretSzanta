import path from 'path'
import http from 'http'
import Express from 'express'
import { initializeIO } from './io'

// initialize the server and configure support for ejs templates
const app = new Express()
const server = new http.Server(app)

// socket.io
initializeIO(server)

// start the server
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'production'
server.listen(port, err => {
    if (err) {
        return console.error(err)
    }
    console.info(`Server running on http://localhost:${port} [${env}]`)
})
