import lodash from 'lodash'
import { SocketEvents, PlayerRole, GamePhases, PlayerAffilications } from '../Dictionary'
import { getCurrentTimestamp } from '../utils/utils'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import {
    getPlayersCount,
    startGame,
    getFacists,
    getPlayerboardType,
    setGamePhase,
    initializeVoting,
    getGamePhase,
    startChancellorChoicePhase,
    getChancellorChoices,
    getPresident,
    getRoleSocket,
    takeChoicePolicyCards,
    getOtherAlivePlayers,
    peekPolicyCards,
    checkWinConditions,
} from '../utils/RoomsManager'

const { forEach, get, map, pick } = lodash

const PhaseSocketEvents = (io) => {
    const socketEventsUtils = SocketEventsUtils(io);
    const phaseSocketEvents = {
        startGame: (socket) => {
            startGame(socket.currentRoom)
            const facists = getFacists(socket.currentRoom)

            // just filtering out emit functions
            const playerCount = getPlayersCount(socket.currentRoom)

            forEach(facists, player => socketEventsUtils.sendBecomeFascist(player, playerCount, facists))
            io.sockets.in(socket.currentRoom).emit(SocketEvents.START_GAME, {
                data: {
                    playerName: socket.currentPlayerName,
                    timestamp: getCurrentTimestamp(),
                    boardType: getPlayerboardType(socket.currentRoom),
                },
            })
        },

        endGame: (socket, whoWon) => {
            setGamePhase(socket.currentRoom, GamePhases.Ended)

            const facists = getFacists(socket.currentRoom)
            const passedFacists = map(facists, facist => pick(facist, ['playerName', 'affiliation', 'facistAvatar']))
            io.sockets.in(socket.currentRoom).emit(SocketEvents.GameFinished, {
                data: {
                    whoWon,
                    facists: passedFacists,
                },
            })
        },

        startVotingPhaseVote: (socket, { playerName: chancellorName }) => {
            initializeVoting(socket.currentRoom, chancellorName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_START, {
                data: {
                    chancellorCandidate: chancellorName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startChancellorChoicePhase: (socket, designatedPresidentName = null) => {
            if (getGamePhase(socket.currentRoom) === GamePhases.GAME_PHASE_SUPERPOWER) return
            startChancellorChoicePhase(socket.currentRoom, designatedPresidentName)
            const playersChoices = getChancellorChoices(socket.currentRoom)

            io.sockets.in(socket.currentRoom).emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, {
                data: {
                    playersChoices,
                    presidentName: getPresident(socket.currentRoom).playerName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startPresidentPolicyChoice: (socket) => {
            const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)

            setGamePhase(socket.currentRoom, GamePhases.PresidentPolicyChoice)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PresidentChoosePolicy, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    presidentName: getPresident(socket.currentRoom).playerName,
                    gamePhase: GamePhases.PresidentPolicyChoice,
                },
            })
            presidentEmit(SocketEvents.ChoosePolicy, {
                data: {
                    policyCards: takeChoicePolicyCards(socket.currentRoom, 3),
                    title: 'Discard one policy and pass the rest to the chancellor',
                    role: PlayerRole.ROLE_PRESIDENT,
                },
            })
        },

        startKillPhase: (socket) => {
            setGamePhase(socket.currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
            const presidentName = get(getPresident(socket.currentRoom), 'playerName')
            const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.KillSuperpowerUsed, {
                data: {
                    presidentName,
                    timestamp: getCurrentTimestamp(),
                    playersChoices,
                },
            })
        },

        startDesignateNextPresidentPhase: (socket) => {
            setGamePhase(socket.currentRoom, GamePhases.DesignateNextPresidentPhase)
            const presidentName = get(getPresident(socket.currentRoom), 'playerName')
            const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.DesignateNextPresident, {
                data: {
                    presidentName,
                    timestamp: getCurrentTimestamp(),
                    playersChoices,
                },
            })
        },

        startPeekAffiliationSuperpowerPhase: (socket) => {
            setGamePhase(socket.currentRoom, GamePhases.PeekAffiliationSuperpowerPhase)
            const presidentName = get(getPresident(socket.currentRoom), 'playerName')
            const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
            socketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see affiliation of one player. Waiting for him to decide who to investigate...' })
            socketEventsUtils.emitSetChooserPlayer(socket, presidentName)
            
            presidentEmit(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
                data: {
                    playersChoices,
                },
            })
        },
        startPeekCardsPhase: (socket) => {
            setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
            const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const presidentName = get(getPresident(socket.currentRoom), 'playerName')
            socketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see next 3 cards, waiting for acknowledgement...' })
            socketEventsUtils.emitSetChooserPlayer(socket, presidentName)
            
            presidentEmit(SocketEvents.PeekCards, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    cards: peekPolicyCards(socket.currentRoom),
                },
            })
        },

        checkIfGameShouldFinish: (socket)  => {
            const { winningSide, reason } = checkWinConditions(socket.currentRoom)
            if (!winningSide) {
                return false; 
            }

            const winningSideName = winningSide === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals' : 'Fascists'
            socketEventsUtils.sendMessage(socket, { content: `${winningSideName} have won - ${reason}` })
            phaseSocketEvents.endGame(socket, winningSide)
            return true
        },
    }
    return phaseSocketEvents
}

export default PhaseSocketEvents
