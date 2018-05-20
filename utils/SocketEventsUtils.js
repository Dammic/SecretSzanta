const { pick, map } = require('lodash')
const { SocketEvents, PlayerAffilications, PolicyCards, GlobalRoomName } = require('../Dictionary')
const { getCurrentTimestamp } = require('./utils')

let cancelTimeoutToken

const SocketEventsUtils = (io, RoomsManager) => {
    const facistSubproperties = ['playerName', 'affiliation', 'facistAvatar']
    const socketEventsUtils = {
        sendMessage: (socket, { content, author }) => {
            io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_SEND_MESSAGE, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    author,
                    content,
                },
            })
        },

        emitSetChooserPlayer: (socket, playerName) => {
            io.sockets.in(socket.currentRoom).emit(SocketEvents.SetChooserPlayer, {
                data: {
                    playerName,
                },
            })
        },

        sendError: (socket, errorMessage) => {
            socket.emit(SocketEvents.CLIENT_ERROR, { error: errorMessage })
        },

        resumeGame: (socket, { delay, func, customMessage }) => {
            if (delay) {
                socketEventsUtils.sendMessage(socket, { content: customMessage || `Next phase will begin in ${delay / 1000} seconds!` })
                io.sockets.in(socket.currentRoom).emit(SocketEvents.SetTimer, {
                    data: {
                        waitTime: delay,
                    },
                })
                cancelTimeoutToken = setTimeout(func.bind(null, socket), delay)
            } else {
                func(socket)
            }
        },

        clearNextPhaseTimeout: () => {
            clearTimeout(cancelTimeoutToken)
        },

        sendBecomeFascist: (player, playerCount, fascists) => {
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
        },

        resetElectionTracker: (socket, positionBeforeReset) => {
            if (positionBeforeReset) {
                io.sockets.in(socket.currentRoom).emit(SocketEvents.ResetTracker, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        trackerPositionBeforeReset: positionBeforeReset,
                    },
                })
                RoomsManager.resetFailedElectionsCount(socket.currentRoom)
                const trackerMessage = `The failed elections tracker${positionBeforeReset === 3 ? ' has reached 3, so it' : ''} will be reset!`
                socketEventsUtils.sendMessage(socket, { content: trackerMessage })
            }
        },

        switchRooms: (socket, startRoom, targetRoom) => {
            if (startRoom) {
                socket.leave(startRoom)
                socketEventsUtils.sendMessage(socket, { content: `${socket.currentPlayerName} has left the room` })

                const updatedRoom = (startRoom === GlobalRoomName ? targetRoom : startRoom)
                if (updatedRoom) {
                    io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                        data: {
                            roomName: updatedRoom,
                            room: RoomsManager.getRoomDetailsForLobby(updatedRoom),
                        },
                    })
                }
            }
            socket.currentRoom = targetRoom
            if (targetRoom) {
                if (startRoom) {
                    RoomsManager.updatePlayerRoom(socket.currentPlayerName, targetRoom)
                }

                if (targetRoom === GlobalRoomName) {
                    socket.emit(SocketEvents.SyncLobby, {
                        data: {
                            players: RoomsManager.getPlayersList(),
                            rooms: RoomsManager.getRoomsList(),
                        },
                    })
                }
                socket.join(targetRoom)
                socketEventsUtils.sendMessage(socket, { content: `${socket.currentPlayerName} has joined the room` })
            }
            io.sockets.in(GlobalRoomName).emit(SocketEvents.PlayersListChanged, {
                data: {
                    playerName: socket.currentPlayerName,
                    player: RoomsManager.getPlayerFromPlayersList(socket.currentPlayerName),
                },
            })
        },
    }
    return socketEventsUtils
}

module.exports = SocketEventsUtils

