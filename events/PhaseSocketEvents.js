const { forEach, get } = require('lodash')
const { SocketEvents, PlayerRole, GamePhases } = require('../Dictionary')
const { getCurrentTimestamp } = require('../utils/utils')
const SocketEventsUtils = require('../utils/SocketEventsUtils')

const PhaseSocketEvents = (io, RoomsManager) => {
    const socketEventsUtils = SocketEventsUtils(io, RoomsManager)
    const phaseSocketEvents = {
        startGame: (socket) => {
            RoomsManager.startGame(socket.currentRoom)
            const facists = RoomsManager.getFacists(socket.currentRoom)

            // just filtering out emit functions
            const playerCount = RoomsManager.getPlayersCount(socket.currentRoom)

            forEach(facists, player => socketEventsUtils.sendBecomeFascist(player, playerCount, facists))
            io.sockets.in(socket.currentRoom).emit(SocketEvents.START_GAME, {
                data: {
                    playerName: socket.currentPlayerName,
                    timestamp: getCurrentTimestamp(),
                    boardType: RoomsManager.getPlayerboardType(socket.currentRoom),
                },
            })
        },

        startVotingPhaseVote: (socket, { playerName: chancellorName }) => {
            RoomsManager.initializeVoting(socket.currentRoom, chancellorName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_START, {
                data: {
                    chancellorCandidate: chancellorName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startChancellorChoicePhase: (socket, designatedPresidentName = null) => {
            RoomsManager.startChancellorChoicePhase(socket.currentRoom, designatedPresidentName)
            const playersChoices = RoomsManager.getChancellorChoices(socket.currentRoom)

            io.sockets.in(socket.currentRoom).emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, {
                data: {
                    playersChoices,
                    presidentName: RoomsManager.getPresident(socket.currentRoom).playerName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startPresidentPolicyChoice: (socket) => {
            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)

            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.PresidentPolicyChoice)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PresidentChoosePolicy, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    presidentName: RoomsManager.getPresident(socket.currentRoom).playerName,
                    gamePhase: GamePhases.PresidentPolicyChoice,
                },
            })
            presidentEmit(SocketEvents.ChoosePolicy, {
                data: {
                    policyCards: RoomsManager.takeChoicePolicyCards(socket.currentRoom, 3),
                    title: 'Discard one policy and pass the rest to the chancellor',
                    role: PlayerRole.ROLE_PRESIDENT,
                },
            })
        },

        startKillPhase: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            const playersChoices = RoomsManager.getOtherAlivePlayers(socket.currentRoom, presidentName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.KillSuperpowerUsed, {
                data: {
                    presidentName,
                    timestamp: getCurrentTimestamp(),
                    playersChoices,
                },
            })
        },

        startDesignateNextPresidentPhase: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.DesignateNextPresidentPhase)
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            const playersChoices = RoomsManager.getOtherAlivePlayers(socket.currentRoom, presidentName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.DesignateNextPresident, {
                data: {
                    presidentName,
                    timestamp: getCurrentTimestamp(),
                    playersChoices,
                },
            })
        },

        startPeekAffiliationSuperpowerPhase: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.PeekAffiliationSuperpowerPhase)
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const playersChoices = RoomsManager.getOtherAlivePlayers(socket.currentRoom, presidentName)
            socketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see affiliation of one player. Waiting for him to decide who to investigate...' })
            io.sockets.in(socket.currentRoom).emit(SocketEvents.SetChooserPlayer, {
                data: {
                    playerName: presidentName,
                },
            })
            presidentEmit(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
                data: {
                    playersChoices,
                },
            })
        },
    }
    return phaseSocketEvents
}

module.exports = PhaseSocketEvents

