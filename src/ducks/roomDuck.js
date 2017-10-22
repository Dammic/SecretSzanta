import { cloneDeep, forEach, find } from 'lodash'
import { PlayerRole } from '../../Dictionary'

// Actions
const ADD_PLAYER = 'room/ADD_PLAYER'
const REMOVE_PLAYER = 'room/REMOVE_PLAYER'
const CHANGE_GAME_PHASE = 'room/CHANGE_GAME_PHASE'
const CHOOSE_NEW_CHANCELLOR = 'room/CHOOSE_NEW_CHANCELLOR'
const CHOOSE_NEW_PRESIDENT = 'room/CHOOSE_NEW_PRESIDENT'
const SYNC_ROOM_DATA = 'room/SYNC_ROOM_DATA'
const INCREASE_POLICY_COUNT = 'room/INCREASE_POLICY_COUNT'
const INCREASE_TRACKER = 'room/INCREASE_TRACKER'
const RESET_TRACKER = 'room/RESET_TRACKER'
const REVEAL_FACISTS = 'room/REVEAL_FACISTS'
const REGISTER_VOTE = 'room/REGISTER_VOTE'
const REVEAL_VOTES = 'room/REVEAL_VOTES'
const RESET_VOTES = 'room/RESET_VOTES'
const KILL_PLAYER = 'room/KILL_PLAYER'

const initialState = {
    maxPlayers: 0,
    ownerName: '',
    playersDict: {},
    gamePhase: '',
    potentialChancellorsChoices: [],
    facistPoliciesCount: 0,
    liberalPoliciesCount: 0,
    trackerPosition: 0,
    votes: null,
}

// Reducer
export default function reducer(state = initialState, action = {}) {
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
            const { maxPlayers, ownerName, trackerPosition, playersDict, gamePhase} = action.payload

            return {
                ...state,
                maxPlayers,
                trackerPosition,
                playersDict,
                gamePhase,
                ownerName,
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

            const previousChancellor = find(newPlayersDict, { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR })
            if (previousChancellor) {
                previousChancellor.role = null
            }
            const currentChancellor = find(newPlayersDict, { role: PlayerRole.ROLE_CHANCELLOR })
            if (currentChancellor) {
                currentChancellor.role = PlayerRole.ROLE_PREVIOUS_CHANCELLOR
            }
            const nextChancellor = newPlayersDict[newChancellor]
            nextChancellor.role = PlayerRole.ROLE_CHANCELLOR

            return {
                ...state,
                playersDict: newPlayersDict,
            }
        }
        case CHOOSE_NEW_PRESIDENT: {
            const { newPresident } = action.payload
            const newPlayersDict = { ...state.playersDict }

            const previousPresident = find(newPlayersDict, { role: PlayerRole.ROLE_PREVIOUS_PRESIDENT })
            if (previousPresident) {
                previousPresident.role = null
            }

            const currentPresident = find(newPlayersDict, { role: PlayerRole.ROLE_PRESIDENT })
            if (currentPresident) {
                currentPresident.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            }

            const nextPresident = newPlayersDict[newPresident]
            nextPresident.role = PlayerRole.ROLE_PRESIDENT

            const previousChancellor = find(newPlayersDict, { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR })
            if (previousChancellor) {
                previousChancellor.role = null
            }

            const currentChancellor = find(newPlayersDict, { role: PlayerRole.ROLE_CHANCELLOR })
            if (currentChancellor) {
                currentChancellor.role = PlayerRole.ROLE_PREVIOUS_CHANCELLOR
            }

            return {
                ...state,
                playersDict: newPlayersDict,
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
            }
            return {
                ...state,
                liberalPoliciesCount: liberalPoliciesCount + 1,
            }
        }
        case INCREASE_TRACKER: {
            const position = state.trackerPosition
            return {
                ...state,
                trackerPosition: position + 1,
            }
        }
        case RESET_TRACKER: {
            return {
                ...state,
                trackerPosition: 0,
            }
        }
        case REVEAL_FACISTS: {
            const { facists } = action.payload

            const newPlayersDict = cloneDeep(state.playersDict)
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
        case REGISTER_VOTE: {
            const { votes } = state
            const { playerName } = action.payload

            return {
                ...state,
                votes: { ...votes, [playerName]: '' },
            }
        }
        case REVEAL_VOTES: {
            const { newVotes } = action.payload

            return {
                ...state,
                votes: newVotes,
            }
        }
        case RESET_VOTES: {
            return {
                ...state,
                votes: null,
            }
        }
        case KILL_PLAYER: {
            const { playerName } = action.payload 
            
            const newPlayersDict = cloneDeep(state.playersDict)
            newPlayersDict[playerName].isDead = true
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
export function addPlayer(player) {
    return {
        type: ADD_PLAYER,
        payload: {
            player,
        },
    }
}

export function removePlayer(playerName) {
    return {
        type: REMOVE_PLAYER,
        payload: {
            playerName,
        },
    }
}

export function killPlayer(playerName) {
    return {
        type: KILL_PLAYER,
        payload: {
            playerName,
        },
    }
}

export function changeGamePhase(gamePhase) {
    return {
        type: CHANGE_GAME_PHASE,
        payload: {
            gamePhase,
        },
    }
}

export function chooseNewChancellor(newChancellor) {
    return {
        type: CHOOSE_NEW_CHANCELLOR,
        payload: {
            newChancellor,
        },
    }
}

export function selectNewPresident(newPresident) {
    return {
        type: CHOOSE_NEW_PRESIDENT,
        payload: {
            newPresident,
        },
    }
}

export function syncRoomData(roomData) {
    return {
        type: SYNC_ROOM_DATA,
        payload: roomData,
    }
}

export function increasePolicyCount(isFacist) {
    return {
        type: INCREASE_POLICY_COUNT,
        payload: {
            isFacist,
        },
    }
}

export function increaseTracker() {
    return {
        type: INCREASE_TRACKER,
    }
}

export function resetTracker() {
    return {
        type: RESET_TRACKER,
    }
}

export function revealFacists(facists) {
    return {
        type: REVEAL_FACISTS,
        payload: {
            facists,
        },
    }
}

export function registerVote(playerName) {
    return {
        type: REGISTER_VOTE,
        payload: {
            playerName,
        },
    }
}

export function revealVotes(votes) {
    return {
        type: REVEAL_VOTES,
        payload: {
            newVotes: votes,
        },
    }
}

export function resetVotes() {
    return {
        type: RESET_VOTES,
    }
}
