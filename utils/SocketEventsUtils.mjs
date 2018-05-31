import lodash from 'lodash'
import { io } from '../io'
import { SocketEvents, PlayerAffilications, GlobalRoomName } from '../Dictionary'
import { getCurrentTimestamp } from './utils'
import {
    resetFailedElectionsCount,
    getRoomsList,
    getRoomDetailsForLobby,
} from './RoomsManager'
import {
    updatePlayerRoom,
    getPlayersList,
    getPlayerFromPlayersList,
} from './PlayersManager'

const { pick, map } = lodash

const facistSubproperties = ['playerName', 'affiliation', 'facistAvatar']

let cancelTimeoutToken

export const sendMessage = (socket, { content, author }) => {
    io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_SEND_MESSAGE, {
        data: {
            timestamp: getCurrentTimestamp(),
            author,
            content,
        },
    })
}

export const emitSetChooserPlayer = (socket, playerName) => {
    io.sockets.in(socket.currentRoom).emit(SocketEvents.SetChooserPlayer, {
        data: {
            playerName,
        },
    })
}

export const sendError = (socket, errorMessage) => {
    socket.emit(SocketEvents.CLIENT_ERROR, { error: errorMessage })
}

export const resumeGame = (socket, { delay, func, customMessage }) => {
    if (delay) {
        sendMessage(socket, { content: customMessage || `Next phase will begin in ${delay / 1000} seconds!` })
        io.sockets.in(socket.currentRoom).emit(SocketEvents.SetTimer, {
            data: {
                waitTime: delay,
            },
        })
        cancelTimeoutToken = setTimeout(func.bind(null, socket), delay)
    } else {
        func(socket)
    }
}

export const clearNextPhaseTimeout = () => {
    clearTimeout(cancelTimeoutToken)
}

export const sendBecomeFascist = (player, playerCount, fascists) => {
    const shouldHideOtherFacists = player.affiliation === PlayerAffilications.HITLER_AFFILIATION && playerCount > 6
    const passedFacists = map(fascists, fascist => pick(fascist, facistSubproperties))
    player.emit(SocketEvents.BECOME_FACIST, {
        data: {
            facists: (shouldHideOtherFacists
                ? pick(player, facistSubproperties)
                : passedFacists
            ),
        },
    })
}

export const resetElectionTracker = (socket, positionBeforeReset) => {
    if (positionBeforeReset) {
        io.sockets.in(socket.currentRoom).emit(SocketEvents.ResetTracker, {
            data: {
                timestamp: getCurrentTimestamp(),
                trackerPositionBeforeReset: positionBeforeReset,
            },
        })
        resetFailedElectionsCount(socket.currentRoom)
        const trackerMessage = `The failed elections tracker${positionBeforeReset === 3 ? ' has reached 3, so it' : ''} will be reset!`
        sendMessage(socket, { content: trackerMessage })
    }
}

export const switchRooms = (socket, startRoom, targetRoom) => {
    if (startRoom) {
        socket.leave(startRoom)
        sendMessage(socket, { content: `${socket.currentPlayerName} has left the room` })

        const updatedRoom = (startRoom === GlobalRoomName ? targetRoom : startRoom)
        if (updatedRoom) {
            io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                data: {
                    roomName: updatedRoom,
                    room: getRoomDetailsForLobby(updatedRoom),
                },
            })
        }
    }
    socket.currentRoom = targetRoom
    if (targetRoom) {
        if (startRoom) {
            updatePlayerRoom(socket.currentPlayerName, targetRoom)
        }

        if (targetRoom === GlobalRoomName) {
            socket.emit(SocketEvents.SyncLobby, {
                data: {
                    players: getPlayersList(),
                    rooms: getRoomsList(),
                },
            })
        }
        socket.join(targetRoom)
        sendMessage(socket, { content: `${socket.currentPlayerName} has joined the room` })
    }
    io.sockets.in(GlobalRoomName).emit(SocketEvents.PlayersListChanged, {
        data: {
            playerName: socket.currentPlayerName,
            player: getPlayerFromPlayersList(socket.currentPlayerName),
        },
    })
}

const SocketEventsUtils = {
    sendMessage,
    emitSetChooserPlayer,
    sendError,
    resumeGame,
    clearNextPhaseTimeout,
    sendBecomeFascist,
    resetElectionTracker,
    switchRooms,
}

export default SocketEventsUtils

