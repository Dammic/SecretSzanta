'use strict'
const path = require('path')
const Server = require('http').Server
const Express = require('express')

// initialize the server and configure support for ejs templates
const app = new Express()
const server = new Server(app)

// routes


app.set('view engine', 'ejs')
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
