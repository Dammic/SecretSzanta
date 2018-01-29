const moment = require('moment')

const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000)
}

const logInfo = ({ currentRoom, currentPlayerName }, message) => {
    console.log(`[${moment().format('MM-DD HH:mm')}] - INFO - [${currentRoom}][${currentPlayerName}]: ${message}`)
}

module.exports = {
    getCurrentTimestamp,
    logInfo,
}
