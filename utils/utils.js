const moment = require('moment')
const { pad } = require('lodash')
const { MessagesTypes } = require('../Dictionary')

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000)

const log = ({ currentRoom, currentPlayerName }, messageType, message) => {
    if (process.env.NODE_HIDECONSOLE) return
    console.log(`[${moment().format('MM-DD HH:mm')}] - ${pad(messageType, 6)} - [${currentRoom}][${currentPlayerName}]: ${message}`)
}

const logInfo = (contextData, message) => log(contextData, MessagesTypes.INFO, message)

const logError = (contextData, message) => log(contextData, MessagesTypes.ERROR, message)

module.exports = {
    getCurrentTimestamp,
    log,
    logInfo,
    logError,
}
