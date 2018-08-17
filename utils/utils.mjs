import moment from 'moment'
import childProcess from 'child_process'
import lodash from 'lodash'
import { MessagesTypes } from '../Dictionary'

const { pad } = lodash

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000)

const getLatestGitCommitHash = () => childProcess
    .execSync('git rev-parse HEAD')
    .toString().trim().slice(0, 7);

const log = ({ currentRoom, currentPlayerName }, messageType, message) => {
    if (process.env.NODE_HIDECONSOLE) return
    console.log(`[${moment().format('MM-DD HH:mm')}] - ${pad(messageType, 6)} - [${currentRoom}][${currentPlayerName}]: ${message}`)
}

const logInfo = (contextData, message) => log(contextData, MessagesTypes.INFO, message)

const logError = (contextData, message) => log(contextData, MessagesTypes.ERROR, message)

export {
    getCurrentTimestamp,
    getLatestGitCommitHash,
    log,
    logInfo,
    logError,
}
