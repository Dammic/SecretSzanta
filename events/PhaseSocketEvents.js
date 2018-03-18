const { forEach, get } = require('lodash')
const { SocketEvents, PlayerRole, GamePhases, PlayerAffilications, PolicyCards } = require('../Dictionary')
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

        endGame: (socket, whoWon) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.Ended)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.GameFinished, { data: { whoWon } })
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
            socketEventsUtils.emitSetChooserPlayer(socket, presidentName)
            
            presidentEmit(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
                data: {
                    playersChoices,
                },
            })
        },
        startPeekCardsPhase: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            socketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see next 3 cards, waiting for acknowledgement...' })
            socketEventsUtils.emitSetChooserPlayer(socket, presidentName)
            
            presidentEmit(SocketEvents.PeekCards, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    cards: RoomsManager.peekPolicyCards(socket.currentRoom),
                },
            })
        },

        checkIfGameShouldFinish: (socket, onContinueCallback) => {
            const { winningSide, reason } = RoomsManager.checkWinConditions(socket.currentRoom)
            if (winningSide) {
                const winningSideName = winningSide === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals' : 'Fascists'
                socketEventsUtils.sendMessage(socket, { content: `${winningSideName} have won - ${reason}` })
                phaseSocketEvents.endGame(socket, winningSide)
            } else {
                onContinueCallback()
            }
        },

        checkForImmediateSuperpowersOrContinue: (socket) => {
            const fascistPolicyCount = RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
            const playerboardType = RoomsManager.getPlayerboardType(socket.currentRoom)
            if (fascistPolicyCount === 1 && playerboardType === PlayerBoards.LargeBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 2 && playerboardType !== PlayerBoards.SmallBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 3) {
                if (playerboardType === PlayerBoards.SmallBoard) {
                    // President will see top 3 cards from the drawPile deck
                    phaseSocketEvents.startPeekCardsPhase(socket)
                } else {
                    // President will designate next president superpower
                    phaseSocketEvents.startDesignateNextPresidentPhase(socket)
                }
            // 4th power is always kill on each board
            } else if (fascistPolicyCount === 4) {
                phaseSocketEvents.startKillPhase(socket)
            // 5th power is always kill AND veto power unlock
            } else if (fascistPolicyCount === 5) {
                RoomsManager.toggleVeto(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' })
                phaseSocketEvents.startKillPhase(socket)
            } else {
                socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
            }
        },
    }
    return phaseSocketEvents
}

module.exports = PhaseSocketEvents

