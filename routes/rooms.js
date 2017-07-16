const express = require('express')
const router = express.Router()

module.exports = function(RoomsManager) {
    router.get('/getRooms', (req, res) => {
        const roomsList = RoomsManager.getRoomsList()
        res.status(200).send(roomsList).end()
    })

    return router
}
