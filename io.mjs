import lodash from 'lodash'
import SocketIO from 'socket.io'
import PhaseSocketEvents from './events/PhaseSocketEvents'
import ClientVerificationHof from './utils/ClientVerificationHof'
import { SocketEvents as SocketEventsDictionary } from './Dictionary'
import socketEvents from './events/SocketEvents'
import { emitMessage } from './events/emits'

const { cloneDeep, partial, mapValues, partialRight } = lodash

export let io = {}

const initializeEvents = () => {
    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''
        // we expect to socket.emit work when passed as an argument
        socket.emit = socket.emit.bind(socket)

        const phaseSocketEventsCopy = cloneDeep(PhaseSocketEvents)
        phaseSocketEventsCopy.startGameEvent = ClientVerificationHof(['isOwner'], phaseSocketEventsCopy.startGameEvent)
        phaseSocketEventsCopy.endGame = ClientVerificationHof(['isOwner'], phaseSocketEventsCopy.endGame)
        socketEvents.kickPlayerEvent = ClientVerificationHof(['isOwner'], socketEvents.kickPlayerEvent)
        socketEvents.superpowerAffiliationPeekPlayer = ClientVerificationHof(['isPresident'], socketEvents.superpowerAffiliationPeekPlayer)
        socketEvents.endPeekPlayerSuperpower = ClientVerificationHof(['isPresident'], socketEvents.endPeekPlayerSuperpower)
        socketEvents.endPeekCardsPhase = ClientVerificationHof(['isPresident'], socketEvents.endPeekCardsPhase)

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions
        const partialFunctions = mapValues({
            ...socketEvents,
            ...phaseSocketEventsCopy,
            sendMessage: (socket, ...rest) => emitMessage(socket.currentRoom, null, ...rest),
        }, func => partial(func, socket))
        partialFunctions.banPlayer = partialRight(partialFunctions.kickPlayerEvent, true)

        socket.on('disconnect', partialFunctions.disconnect)
        socket.on(SocketEventsDictionary.CLIENT_CREATE_ROOM, partialFunctions.createRoom)
        socket.on(SocketEventsDictionary.CLIENT_SEND_MESSAGE, partialFunctions.sendMessage)
        socket.on(SocketEventsDictionary.CLIENT_JOIN_ROOM, partialFunctions.joinRoom)
        socket.on(SocketEventsDictionary.VOTING_PHASE_START, partialFunctions.startVotingPhaseVote)
        socket.on(SocketEventsDictionary.CLIENT_VOTE, partialFunctions.voteEvent)
        socket.on(SocketEventsDictionary.START_GAME, partialFunctions.startGameEvent)
        socket.on(SocketEventsDictionary.CHANCELLOR_CHOICE_PHASE, partialFunctions.startChancellorChoicePhaseEvent)
        socket.on(SocketEventsDictionary.PlayerKilled, partialFunctions.killPlayerEvent)
        socket.on(SocketEventsDictionary.PlayerBanned, partialFunctions.banPlayer)
        socket.on(SocketEventsDictionary.PlayerKicked, partialFunctions.kickPlayerEvent)
        socket.on(SocketEventsDictionary.VetoVoteRegistered, partialFunctions.veto)
        socket.on(SocketEventsDictionary.ChoosePolicy, partialFunctions.choosePolicy)
        socket.on(SocketEventsDictionary.SelectName, partialFunctions.selectName)
        socket.on(SocketEventsDictionary.DesignateNextPresident, partialFunctions.presidentDesignatedNextPresident)
        socket.on(SocketEventsDictionary.SuperpowerAffiliationPeekPlayerChoose, partialFunctions.superpowerAffiliationPeekPlayer)
        socket.on(SocketEventsDictionary.SuperpowerAffiliationPeekAffiliationReveal, partialFunctions.endPeekPlayerSuperpower)
        socket.on(SocketEventsDictionary.PeekCards, partialFunctions.endPeekCardsPhase)
        socket.on(SocketEventsDictionary.GameFinished, partialFunctions.endGame)
    })
}

export const initializeIO = (server) => {
    io = SocketIO(server)
    initializeEvents()
}
