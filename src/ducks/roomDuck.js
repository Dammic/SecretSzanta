'use strict'
import { SocketEvents, PlayerRole } from '../../Dictionary'
import { forEach, find } from 'lodash'

// Actions
const ADD_PLAYER = 'room/ADD_PLAYER'
const REMOVE_PLAYER = 'room/REMOVE_PLAYER'
const CHANGE_GAME_PHASE = 'room/CHANGE_GAME_PHASE'
const CHOOSE_NEW_CHANCELLOR = 'room/CHOOSE_NEW_CHANCELLOR'
const CHOOSE_NEW_PRESIDENT = 'room/CHOOSE_NEW_PRESIDENT'
const TOGGLE_CHANCELLOR_CHOICE_MODAL = 'room/TOGGLE_CHANCELLOR_CHOICE_MODAL'
const TOGGLE_VOTING_MODAL = 'room/TOGGLE_VOTING_MODAL'
const SYNC_ROOM_DATA = 'room/SYNC_ROOM_DATA'
const INCREASE_POLICY_COUNT = 'room/INCREASE_POLICY_COUNT'
const REVEAL_FACISTS = 'room/REVEAL_FACISTS'

const initialState = {
    maxPlayers: 0,
    playersDict: {},
    chancellorCandidate: null,
    gamePhase: '',
    isChancellorChoiceModalShown: false,
    isVotingModalShown: false,
    potentialChancellorsChoices: [],
    facistPoliciesCount: 0,
    liberalPoliciesCount: 0,
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case ADD_PLAYER: {
            const { player } = action.payload
            const { playersDict } = state

            return {
                ...state,
                playersDict: { ...playersDict, [player.playerName]: player },
            }
        }
        case REMOVE_PLAYER: {
            const { playerName } = action.payload
            const newPlayersDict = { ...state.playersDict }
            delete newPlayersDict[playerName]

            return {
                ...state,
                playersDict: newPlayersDict,
            }
        }
        case SYNC_ROOM_DATA: {
            const { maxPlayers, playersDict, gamePhase, chancellorCandidate } = action.payload

            return {
                ...state,
                maxPlayers,
                playersDict,
                gamePhase,
                chancellorCandidate,
            }
        }
        case CHANGE_GAME_PHASE: {
            const { gamePhase } = action.payload

            return {
                ...state,
                gamePhase,
            }
        }
        case CHOOSE_NEW_CHANCELLOR: {
            const { newChancellor } = action.payload
            const newPlayersDict = { ...state.playersDict }
            
            newPlayersDict[newChancellor].role = PlayerRole.ROLE_CHANCELLOR
            return {
                ...state,
                playersDict: newPlayersDict,
            }
        }
        case CHOOSE_NEW_PRESIDENT: {
            const { newPresident } = action.payload
            const newPlayersDict = { ...state.playersDict }
            newPlayersDict[newPresident].role = PlayerRole.ROLE_PRESIDENT 
            return {
                ...state,
                playersDict: newPlayersDict,
            }
        }
        case TOGGLE_CHANCELLOR_CHOICE_MODAL: {
            const { isVisible, potentialChancellorsChoices } = action.payload
            return {
                ...state,
                isChancellorChoiceModalShown: isVisible,
                potentialChancellorsChoices: (isVisible ? potentialChancellorsChoices : []),
            }
        }
        case TOGGLE_VOTING_MODAL: {
            const { isVisible, chancellorCandidate } = action.payload
            return {
                ...state,
                isVotingModalShown: isVisible,
                chancellorCandidate: (isVisible ? chancellorCandidate : null),
            }
        }
        case INCREASE_POLICY_COUNT: {
            const { facistPoliciesCount, liberalPoliciesCount } = state
            const { isFacist } = action.payload

            if (isFacist) {
                return {
                    ...state,
                    facistPoliciesCount: facistPoliciesCount + 1,
                }
            } else {
                return {
                    ...state,
                    liberalPoliciesCount: liberalPoliciesCount + 1,
                }
            }
        }
        case REVEAL_FACISTS: {
            const { facists } = action.payload
            
            const newPlayersDict = { ...state.playersDict }
            forEach(facists, (facist) => {
                const player = newPlayersDict[facist.playerName]
                if (player) {
                    player.affiliation = facist.affiliation
                    player.facistAvatar = facist.facistAvatar
                }
            })
            return {
                ...state,
                playersDict: newPlayersDict,
            }
        }
        default:
            return state
    }
}

// Action Creators
export function addPlayer (player) {
    return {
        type: ADD_PLAYER,
        payload: {
            player,
        },
    }
}

export function removePlayer (playerName) {
    return {
        type: REMOVE_PLAYER,
        payload: {
            playerName,
        },
    }
}

export function changeGamePhase (gamePhase) {
    return {
        type: CHANGE_GAME_PHASE,
        payload: {
            gamePhase,
        },
    }
}

export function chooseNewChancellor (newChancellor) {
    return {
        type: CHOOSE_NEW_CHANCELLOR,
        payload: {
            newChancellor,
        },
    }
}

export function selectNewPresident (newPresident) {
    console.info(newPresident)
    return {
        type: CHOOSE_NEW_PRESIDENT,
        payload: {
            newPresident,
        },
    }
}

export function toggleChancellorChoiceModal (isVisible, potentialChancellorsChoices = null) {
    return {
        type: TOGGLE_CHANCELLOR_CHOICE_MODAL,
        payload: {
            isVisible,
            potentialChancellorsChoices,
        },
    }
}

export function toggleVotingModal (isVisible, chancellorCandidate = null) {
    return {
        type: TOGGLE_VOTING_MODAL,
        payload: {
            isVisible,
            chancellorCandidate,
        },
    }
}

export function syncRoomData (maxPlayers, playersDict, gamePhase, chancellorCandidate) {
    return {
        type: SYNC_ROOM_DATA,
        payload: {
            maxPlayers,
            playersDict,
            gamePhase,
            chancellorCandidate,
        },
    }
}

export function increasePolicyCount (isFacist) {
    return {
        type: INCREASE_POLICY_COUNT,
        payload: {
            isFacist,
        },
    }
}

export function revealFacists(facists) {
    return {
        type: REVEAL_FACISTS,
        payload: {
            facists, 
        },
    };
}
