'use strict'
import {SocketEvents} from '../../Dictionary'

// Actions
const ADD_PLAYER = 'room/ADD_PLAYER'
const REMOVE_PLAYER = 'room/REMOVE_PLAYER'
const CHANGE_GAME_PHASE = 'room/CHANGE_GAME_PHASE'
const CHOOSE_NEW_CHANCELLOR = 'room/CHOOSE_NEW_CHANCELLOR'
const CHOOSE_NEW_PRESIDENT = 'room/CHOOSE_NEW_PRESIDENT'
const TOGGLE_CHANCELLOR_CHOICE_MODAL = 'room/TOGGLE_CHANCELLOR_CHOICE_MODAL'
const TOGGLE_VOTING_MODAL = 'room/TOGGLE_VOTING_MODAL'
const SYNC_ROOM_DATA = 'room/SYNC_ROOM_DATA'

const initialState = {
    maxPlayers: 0,
    playersCount: 0,
    slots: [],
    playersList: [],
    chancellorCandidate: null,
    gamePhase: '',
    president: null,
    chancellor: null,
    isChancellorChoiceModalShown: false,
    isVotingModalShown: false,
    potentialChancellorsChoices: []
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case ADD_PLAYER: {
            const {playerInfo} = action.payload
            const {playersList, slots, playersCount} = state

            const newSlots = [...slots]
            newSlots[playerInfo.slotID - 1] = playerInfo
            return {
                ...state,
                slots: newSlots,
                playersList: [...playersList, {playerName: playerInfo.playerName, avatarNumber: playerInfo.avatarNumber} ],
                playersCount: playersCount + 1
            }
        }
        case REMOVE_PLAYER: {
            const {playerName, slotID} = action.payload
            const {playersList, slots, playersCount} = state

            let newSlots = [...slots]
            newSlots[slotID - 1].player = null
            const newPlayersList = playersList.filter((player) => {
                return (player.playerName !== playerName)
            })

            return {
                ...state,
                playersList: newPlayersList,
                slots: newSlots,
                playersCount: playersCount - 1
            }
        }
        case SYNC_ROOM_DATA: {
            const {maxPlayers, playersCount, slots, playersList, gamePhase, chancellorCandidate} = action.payload
            return {
                ...state,
                maxPlayers,
                playersCount,
                slots,
                playersList,
                gamePhase,
                chancellorCandidate
            }
        }
        case CHANGE_GAME_PHASE: {
            const {gamePhase} = action.payload
            return {
                ...state,
                gamePhase
            }
        }
        case CHOOSE_NEW_CHANCELLOR: {
            const {newChancellor} = action.payload
            return {
                ...state,
                chancellor: newChancellor
            }
        }
        case CHOOSE_NEW_PRESIDENT: {
            const {newPresident} = action.payload
            return {
                ...state,
                president: newPresident
            }
        }
        case TOGGLE_CHANCELLOR_CHOICE_MODAL: {
            const {isVisible, potentialChancellorsChoices} = action.payload
            return {
                ...state,
                isChancellorChoiceModalShown: isVisible,
                potentialChancellorsChoices: (isVisible ? potentialChancellorsChoices : [])
            }
        }
        case TOGGLE_VOTING_MODAL: {
            const {isVisible, chancellorCandidate} = action.payload
            return {
                ...state,
                isVotingModalShown: isVisible,
                chancellorCandidate: (isVisible ? chancellorCandidate : null)
            }
        }
        default:
            return state
    }
}

// Action Creators
export function addPlayer (playerInfo) {
    return {
        type: ADD_PLAYER,
        payload: {
            playerInfo: playerInfo
        }
    }
}

export function removePlayer (playerName, slotID) {
    return {
        type: REMOVE_PLAYER,
        payload: {
            playerName,
            slotID
        }
    }
}

export function changeGamePhase (gamePhase) {
    return {
        type: CHANGE_GAME_PHASE,
        payload: {
            gamePhase
        }
    }
}

export function chooseNewChancellor (newChancellor) {
    return {
        type: CHOOSE_NEW_CHANCELLOR,
        payload: {
            newChancellor
        }
    }
}

export function selectNewPresident (newPresident) {
    return {
        type: CHOOSE_NEW_PRESIDENT,
        payload: {
            newPresident
        }
    }
}

export function toggleChancellorChoiceModal (isVisible, potentialChancellorsChoices = null) {
    return {
        type: TOGGLE_CHANCELLOR_CHOICE_MODAL,
        payload: {
            isVisible,
            potentialChancellorsChoices
        }
    }
}

export function toggleVotingModal (isVisible, chancellorCandidate = null) {
    return {
        type: TOGGLE_VOTING_MODAL,
        payload: {
            isVisible,
            chancellorCandidate
        }
    }
}

export function syncRoomData (maxPlayers, playersCount, slots, playersList, gamePhase, chancellorCandidate) {
    return {
        type: SYNC_ROOM_DATA,
        payload: {
            maxPlayers,
            playersCount,
            slots,
            playersList,
            gamePhase,
            chancellorCandidate
        }
    }
}