const moment = require('moment')
const { MessagesTypes } = require('../Dictionary')

const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000)
}

const log =({ currentRoom, currentPlayerName }, messageType, message) => {
    console.log(`[${moment().format('MM-DD HH:mm')}] - ${messageType} - [${currentRoom}][${currentPlayerName}]: ${message}`)
}

const logInfo = (contextData, message) => log(contextData, MessagesTypes.INFO, message)

const logError = (contextData, message) => log(contextData, MessagesTypes.ERROR, message)

module.exports = {
    getCurrentTimestamp,
    log,
    logInfo,
    logError,
}
