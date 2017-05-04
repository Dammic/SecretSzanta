'use strict'
import {SocketEvents} from '../../Dictionary'

const initialState = {
    maxPlayers: 0,
    playersCount: 0,
    slots: [],
    playersList: [],
    chancellorCandidate: null,
    gamePhase: '',
    president: null,
    chancellor: null,
    isChancellorChoiceShown: false,
    potentialChancellorsChoices: []
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case SocketEvents.CLIENT_GET_ROOM_DATA: {
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
        case SocketEvents.CLIENT_JOIN_ROOM: {
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
        case SocketEvents.CLIENT_LEAVE_ROOM: {
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
        case SocketEvents.VOTING_PHASE_START: {
            const {chancellorCandidate} = action.payload
            return {
                ...state,
                isVotingModalShown: true,
                chancellorCandidate: chancellorCandidate,
                gamePhase: GamePhases.GAME_PHASE_VOTING
            }
        }
        case SocketEvents.START_GAME: {
            const {gamePhase} = action.payload
            return {
                ...state,
                gamePhase
            }
        }
        case SocketEvents.VOTING_PHASE_REVEAL: {
            const {newChancellor} = action.payload
            if (newChancellor) {
                return {
                    ...state,
                    chancellor: newChancellor
                }
            } else return state
        }
        case SocketEvents.CHANCELLOR_CHOICE_PHASE: {
            const {president, playersChoices} = action.payload
            console.info(action.payload)
            const {userName} = state
            if (president.playerName === userName) {
                return {
                    ...state,
                    president,
                    potentialChancellorsChoices: playersChoices
                }
            } else return {
                ...state,
                president
            }
        }
        default:
            return state
    }
}

// Action Creators
export function someAction (aaa) {
    return {
        type: TEST,
        payload: {
            TESTVAR: aaa
        }
    }
}