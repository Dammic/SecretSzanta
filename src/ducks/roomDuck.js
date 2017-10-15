import { handleActions, createAction } from 'redux-actions'
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
const REVEAL_FACISTS = 'room/REVEAL_FACISTS'
const REGISTER_VOTE = 'room/REGISTER_VOTE'
const REVEAL_VOTES = 'room/REVEAL_VOTES'
const KILL_PLAYER = 'room/KILL_PLAYER'

const addPlayer = createAction(ADD_PLAYER)
const removePlayer = createAction(REMOVE_PLAYER)
const changeGamePhase = createAction(CHANGE_GAME_PHASE)
const chooseNewChancellor = createAction(CHOOSE_NEW_CHANCELLOR)
const chooseNewPresident = createAction(CHOOSE_NEW_PRESIDENT)
const syncRoomData = createAction(SYNC_ROOM_DATA)
const increasePolicyCount = createAction(INCREASE_POLICY_COUNT)
const revealFacists = createAction(REVEAL_FACISTS)
const registerVote = createAction(REGISTER_VOTE)
const revealVotes = createAction(REVEAL_VOTES)
const killPlayer = createAction(KILL_PLAYER)

const initialState = {
    maxPlayers: 0,
    playersDict: {},
    gamePhase: '',
    potentialChancellorsChoices: [],
    facistPoliciesCount: 0,
    liberalPoliciesCount: 0,
    votes: null,
}

const actions = {
    [ADD_PLAYER]: (state, action) => {
        const { player } = action.payload
        const { playersDict } = state

        return {
            ...state,
            playersDict: { ...playersDict, [player.playerName]: player },
        }
    },
    [REMOVE_PLAYER]: (state, action) => {
        const { playerName } = action.payload
        const newPlayersDict = { ...state.playersDict }
        delete newPlayersDict[playerName]

        return {
            ...state,
            playersDict: newPlayersDict,
        }
    },
    [SYNC_ROOM_DATA]: (state, action) => {
        const { maxPlayers, playersDict, gamePhase } = action.payload

        return {
            ...state,
            maxPlayers,
            playersDict,
            gamePhase,
        }
    },
    [CHANGE_GAME_PHASE]: (state, action) => {
        const { gamePhase } = action.payload

        return {
            ...state,
            gamePhase,
        }
    },
    [CHOOSE_NEW_CHANCELLOR]: (state, action) => {
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
    },
    [CHOOSE_NEW_PRESIDENT]: (state, action) => {
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
            votes: null,
        }
    },
    [INCREASE_POLICY_COUNT]: (state, action) => {
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
    },
    [REVEAL_FACISTS]: (state, action) => {
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
    },
    [REGISTER_VOTE]: (state, action) => {
        const { votes } = state
        const { playerName } = action.payload

        return {
            ...state,
            votes: { ...votes, [playerName]: '' },
        }
    },
    [REVEAL_VOTES]: (state, action) => {
        const { newVotes } = action.payload

        return {
            ...state,
            votes: newVotes,
        }
    },
    [KILL_PLAYER]: (state, action) => {
        const { playerName } = action.payload

        const newPlayersDict = cloneDeep(state.playersDict)
        newPlayersDict[playerName].isDead = true
        return {
            ...state,
            playersDict: newPlayersDict,
        }
    },
}
export {
    addPlayer, removePlayer, changeGamePhase, chooseNewChancellor,
    chooseNewPresident, syncRoomData, increasePolicyCount, revealFacists,
    registerVote, revealVotes, killPlayer,
}

export default handleActions(actions, initialState)
