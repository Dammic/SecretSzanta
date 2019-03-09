import lodash from 'lodash'
import { io } from '../io'
import {
    getCurrentTimestamp,
    logInfo,
    logError,
} from '../utils/utils'
import {
    SocketEvents,
    MessagesTypes,
    GamePhases,
    PlayerAffilications,
    ErrorMessages,
    ErrorMappedMessages,
    PlayerRole,
    PolicyCards,
    GlobalRoomName,
} from '../Dictionary'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import PhaseSocketEvents from './PhaseSocketEvents'
import {
    enactPolicyEvent,
    checkForNextStep,
    updateTrackerPosition,
} from './EnactPolicyEvents'
import {
    setGamePhase,
    clearVetoVotes,
    getRoleSocket,
    getGamePhase,
    getVetoVotes,
    getPlayerRole,
    addVetoVote,
    didVetoSucceed,
    discardPolicyByVeto,
    getPolicyCardsCount,
    isRoomPresent,
    getRoomOwner,
    removePlayer,
    findNewRoomOwner,
    getRoomDetails,
    getPlayersCount,
    getFacists,
    removeRoom,
    initializeRoom,
    getRoomDetailsForLobby,
    isInBlackList,
    vote,
    getRemainingVotesCount,
    addPlayer,
    didAllVote,
    getVotingResult,
    setChancellor,
    getVotes,
    getChancellor,
    getDrawnCards,
    getPlayerInfo,
    getPresident,
    discardPolicy,
    killPlayer,
    getHitler,
    kickPlayer,
    discardAllCards,
    chooseNextPresident,
    initializeVoting,
    isVetoUnlocked,
    checkIfGameShouldFinish,
    getChancellorCandidateInfo,
} from '../utils/RoomsManager'
import * as emits from './emits'
import { TimeDelay } from './consts'

import {
    isInPlayersList,
    addPlayerToPlayersList,
    removePlayerFromPlayersList,
} from '../utils/PlayersManager'

const { isNil, includes, find, get, truncate } = lodash

export const triggerVetoPrompt = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.ServerWaitingForVeto)

    const delay = TimeDelay.VETO_DELAY
    
    const notifyAndResume = (delay) => {
        const messageContent = 'The president and chancellor can now veto the enacted policy for {counter}. Otherwise the chancellor choice phase will begin.'
        emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, { counter: delay / 1000 })

        emits.emitServerWaitingForVeto(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
        emits.emitServerWaitingForVeto(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
        
        return PhaseSocketEvents.startChancellorChoicePhaseEvent
    }
    checkForNextStep(socket, false, notifyAndResume, delay)
}

// protect it that it can only be fired by president OR chancellor ONCE
export const veto = (socket) => {
    const gamePhase = getGamePhase(socket.currentRoom)
    if (gamePhase !== GamePhases.ServerWaitingForVeto) {
        logError(socket, 'Player tried to veto when the server was not waiting for it!')
        emits.emitError(socket.emit, 'You cannot veto right now!')
        return
    }
    const vetoVotes = getVetoVotes(socket.currentRoom)
    const playerRole = getPlayerRole(socket.currentRoom, socket.currentPlayerName)
    if (includes(vetoVotes, playerRole)) {
        logError(socket, 'Player tried to vote twice!')
        emits.emitError(socket.emit, 'You cannot veto twice!')
        return
    }
    if (!includes([PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT], playerRole)) {
        logError(socket, `Player with role ${playerRole} tried to veto - only president and chancellor are allowed to!`)
        emits.emitError(socket.emit, 'You must be a president or a chancellor to veto!')
        return
    }
    addVetoVote(socket.currentRoom, socket.currentPlayerName)

    const roleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'president' : 'chancellor'
    if (didVetoSucceed(socket.currentRoom)) {
        setGamePhase(socket.currentRoom, GamePhases.ServerAcceptedVeto)
        
        const messageContent = 'The {roleBold} invoked veto for the enacted policy as well! The enacted policy has been rejected!'
        emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, { roleBold: roleString })

        SocketEventsUtils.clearNextPhaseTimeout()
        discardPolicyByVeto(socket.currentRoom)

        // updateTrackerPosition doesn't resume game (it will always inc tracker from 0 to 1)
        updateTrackerPosition(socket, false)

        // TODO: check if we need this resumeGame (and if we can move it somewhere else?)
        emits.emitSyncPolicies(socket.currentRoom)

        checkForNextStep(socket)
    } else {
        const missingVetoRoleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'chancellor' : 'president'

        const messageContent = 'The {roleBold} has proposed veto for the enacted policy! Waiting for {missingRoleBold} to decide!'
        emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, {
            roleBold: roleString,
            missingRoleBold: missingVetoRoleString,
        })
    }
}

export const disconnect = (socket) => {
    if (socket.currentRoom && isRoomPresent(socket.currentRoom)) {
        const roomOwnerName = getRoomOwner(socket.currentRoom).playerName

        removePlayer(socket.currentRoom, socket.currentPlayerName)
        emits.emitPlayerLeftRoom(socket.currentRoom, socket.currentPlayerName)

        if (socket.currentPlayerName === roomOwnerName) {
            const newOwner = findNewRoomOwner(socket.currentRoom)
            if (!isNil(newOwner)) {
                emits.emitRoomData(socket.currentRoom, newOwner.emit)

                if (newOwner.affiliation === PlayerAffilications.FACIST_AFFILIATION
                    || newOwner.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
                    const fascists = getFacists(socket.currentRoom)
                    emits.emitBecomeFascistToPlayer(socket.currentRoom, newOwner, fascists)
                }
                emits.emitMessage(socket.currentRoom, newOwner.emit, 'You have become the new owner of this room!')
            } else {
                emits.emitRoomsListChanged(socket.currentRoom)
                removeRoom(socket.currentRoom)
                logInfo(socket, 'The room was permanently removed!')
            }
        }
    }

    removePlayerFromPlayersList(socket.currentPlayerName)
    SocketEventsUtils.switchRooms(socket, socket.currentRoom, '')
    socket.currentPlayerName = ''
}

export const joinRoom = (socket, { roomName }) => {
    if (!roomName || socket.currentRoom !== GlobalRoomName || !isRoomPresent(roomName)) {
        logError(socket, 'Player tried to enter nonexistent room!')
        emits.emitError(socket.emit, 'The room does not exist!')
        return
    }

    if (isInBlackList(roomName, socket.currentPlayerName)) {
        logInfo(socket, 'Banned player tried to enter the room!')
        emits.emitError(socket.emit, 'You are BANNED in this room by the owner!')
        return
    }

    const addingError = addPlayer(roomName, socket.currentPlayerName, socket)

    if (addingError !== undefined) {
        emits.emitError(socket.emit, ErrorMappedMessages[addingError])
        return
    }

    SocketEventsUtils.switchRooms(socket, socket.currentRoom, roomName)

    emits.emitAllowEnteringRoom(socket.currentRoom, socket.emit)
    emits.emitRoomData(socket.currentRoom, socket.emit)
    emits.emitPlayerJoinedRoom(socket.currentRoom, socket.currentPlayerName)
}

export const createRoom = (socket, { roomName, maxPlayers, password }) => {
    // if the room does not exist, create it
    if (roomName && !isRoomPresent(roomName)) {
        initializeRoom(roomName, socket.currentPlayerName, maxPlayers, password)

        emits.emitRoomsListChanged(roomName, roomName)
        joinRoom(socket, { roomName })
    } else {
        logError(socket, 'Selected room is already present! Cannot create a duplicate!')
        emits.emitError(socket.emit, 'You cannot create duplicate of this room!')
    }
}

export const voteEvent = (socket, { value }) => {
    vote(socket.currentRoom, socket.currentPlayerName, value)
    emits.emitNewVote(socket.currentRoom, socket.currentPlayerName)

    if (didAllVote(socket.currentRoom)) {
        const hasVotingSucceed = getVotingResult(socket.currentRoom)

        if (hasVotingSucceed) {
            setChancellor(socket.currentRoom)
        }

        emits.emitVotingResult(socket.currentRoom)

        const hasPolicyBeenEnacted = updateTrackerPosition(socket, hasVotingSucceed)
        const delay = TimeDelay.NEAR_INSTANT
        
        const notifyAndResume = (delay) => {
            let onResume
            let messageContent

            if (hasVotingSucceed) {
                onResume = PhaseSocketEvents.startPresidentPolicyChoice
                messageContent = 'Voting succeeded.'
            } else {
                onResume = PhaseSocketEvents.startChancellorChoicePhaseEvent
                messageContent = 'Voting failed. Next president will now choose a chancelor.'
            }

            emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent)
            return onResume
        }
        
        checkForNextStep(
            socket,
            hasPolicyBeenEnacted,
            notifyAndResume,
            delay,
        )
    }
}

export const choosePolicyChancellor = (socket, choice) => {
    enactPolicyEvent(socket, choice)

    const policyName = choice === PolicyCards.FacistPolicy ? 'fascist' : 'liberal'
    const messageContent = 'A {policyNameBold} policy has been enacted!'
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, { policyNameBold: policyName })

    if (isVetoUnlocked(socket.currentRoom)) {
        triggerVetoPrompt(socket)
    } else {
        checkForNextStep(socket, true)
    }
}

export const choosePolicyPresident = ({ currentRoom }, choice, drawnCards, chancellorName) => {
    setGamePhase(currentRoom, GamePhases.ChancellorPolicyChoice)

    emits.emitChancellorWillChoosePolicy(currentRoom, chancellorName)

    discardPolicy(currentRoom, choice)

    const messageContent = 'The chancellor will now enact one of the 2 policies passed by the president…'
    emits.emitGameNotification(currentRoom, MessagesTypes.STATUS, messageContent)

    emits.emitChoosePolicyToChancellor(currentRoom, drawnCards)
}

export const choosePolicy = (socket, { choice }) => {
    const { gamePhase } = getRoomDetails(socket.currentRoom)
    let drawnCards = getDrawnCards(socket.currentRoom)
    if (includes(drawnCards, choice)) {
        const president = getPresident(socket.currentRoom)
        const chancellor = getChancellor(socket.currentRoom)
        if (gamePhase === GamePhases.PresidentPolicyChoice && president.playerName === socket.currentPlayerName) {
            choosePolicyPresident(socket, choice, drawnCards, chancellor.playerName)
        } else if (gamePhase === GamePhases.ChancellorPolicyChoice && chancellor.playerName === socket.currentPlayerName) {
            choosePolicyChancellor(socket, choice)
        } else {
            console.error('Cheater!')
            // cheating (bad role tried to choose)?
        }
    } else {
        console.error('Cheater!')
        // cheating (sent card was not in collection)!
    }
}

export const killPlayerEvent = (socket, { playerName }) => {
    killPlayer(socket.currentRoom, playerName)
    emits.emitPlayerKilled(socket.currentRoom, playerName)
    checkForNextStep(socket)
}

export const kickIfPresident = (socket, playerName) => {
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    if (playerName !== presidentName) return false

    discardAllCards(socket.currentRoom)
    chooseNextPresident(socket.currentRoom)
    initializeVoting(socket.currentRoom) // resets chancellor player name
    setChancellor(socket.currentRoom)

    // in future, the game will need to be rollbacked to latest biggest event, so leaving resumeGame for now
    SocketEventsUtils.resumeGame(socket, { delay: TimeDelay.NEAR_INSTANT, func: PhaseSocketEvents.startChancellorChoicePhaseEvent })
    return true
}

export const kickIfHitler = (socket, playerName) => {
    const hitlerName = get(getHitler(socket.currentRoom), 'playerName')
    return playerName === hitlerName
}

export const kickPlayerEvent = (socket, { playerName }, permanently = false) => {
    const hasGameBegan = getGamePhase(socket.currentRoom) !== GamePhases.GAME_PHASE_NEW
    const isOverlaysHidingNeeded = hasGameBegan && (
        kickIfHitler(socket, playerName)
        || kickIfPresident(socket, playerName)
    )

    kickPlayer(socket.currentRoom, playerName, permanently)
    SocketEventsUtils.clearNextPhaseTimeout()

    emits.emitPlayerKicked(socket.currentRoom, playerName, permanently, isOverlaysHidingNeeded)

    const kickedSocket = find(io.sockets.in(socket.currentRoom).sockets, { currentPlayerName: playerName })
    SocketEventsUtils.switchRooms(kickedSocket, socket.currentRoom, GlobalRoomName)
}

export const selectName = (socket, { userName }) => {
    // deselecting name
    if (!userName) {
        removePlayerFromPlayersList(socket.currentPlayerName)
        SocketEventsUtils.switchRooms(socket, GlobalRoomName, '')
        emits.emitSelectNameToPlayer(socket.emit, '')
        socket.currentPlayerName = ''
    // selecting name
    } else if (!isInPlayersList(userName)) {
        addPlayerToPlayersList(userName)
        emits.emitSelectNameToPlayer(socket.emit, userName)
        socket.currentPlayerName = userName
        SocketEventsUtils.switchRooms(socket, '', GlobalRoomName)
    } else {
        emits.emitError(socket.emit, ErrorMessages.NameTaken)
    }
}

export const presidentDesignatedNextPresident = (socket, { playerName }) => {
    emits.emitChooserPlayer(socket.currentRoom, '')
    const delay = TimeDelay.MEDIUM_DELAY

    const notifyAndResume = (delay) => {
        const messageContent = '{playerNameBold} has been designated as the next president for the next turn! Chancellor choice phase will begin in {counter}…'
        emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, {
            playerNameBold: playerName,
            counter: delay / 1000,
        })

        return socketObject => PhaseSocketEvents.startChancellorChoicePhaseEvent(socketObject, playerName);
    }

    checkForNextStep(socket, false, notifyAndResume, delay)
}

export const superpowerAffiliationPeekPlayer = (socket, { playerName }) => {
    const messageContent = 'The president will now see {playerNameBold} affiliation. Waiting for his acknowledgement…'
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, {
        playerNameBold: truncate(playerName, 15),
    })

    emits.emitPlayerAffiliationToPresident(socket.currentRoom, playerName)
}

export const endPeekPlayerSuperpower = (socket) => {
    emits.emitChooserPlayer(socket.currentRoom, '')
    checkForNextStep(socket)
}

export const endPeekCardsPhase = (socket) => {
    emits.emitChooserPlayer(socket.currentRoom, '')
    checkForNextStep(socket)
}

const socketEvents = {
    triggerVetoPrompt,
    veto,
    disconnect,
    createRoom,
    joinRoom,
    voteEvent,
    choosePolicy,
    choosePolicyChancellor,
    choosePolicyPresident,
    killPlayerEvent,
    kickPlayerEvent,
    kickIfPresident,
    kickIfHitler,
    presidentDesignatedNextPresident,
    superpowerAffiliationPeekPlayer,
    endPeekPlayerSuperpower,
    endPeekCardsPhase,
    selectName,
}

export default socketEvents
