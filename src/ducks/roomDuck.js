import { handleActions, createAction } from 'redux-actions'
import { cloneDeep, forEach, find } from 'lodash'
import { PlayerRole } from '../../Dictionary'

// Actions
const addPlayer = createAction('room/addPlayer')
const removePlayer = createAction('room/REMOVE_PLAYER')
const changeGamePhase = createAction('room/CHANGE_GAME_PHASE')
const chooseNewChancellor = createAction('room/CHOOSE_NEW_CHANCELLOR')
const chooseNewPresident = createAction('room/CHOOSE_NEW_PRESIDENT')
const syncRoomData = createAction('room/SYNC_ROOM_DATA')
const increasePolicyCount = createAction('room/INCREASE_POLICY_COUNT')
const revealFacists = createAction('room/REVEAL_FACISTS')
const registerVote = createAction('room/REGISTER_VOTE')
const revealVotes = createAction('room/REVEAL_VOTES')
const killPlayer = createAction('room/KILL_PLAYER')

const initialState = {
    maxPlayers: 0,
    ownerName: '',
    playersDict: {},
    gamePhase: '',
    potentialChancellorsChoices: [],
    facistPoliciesCount: 0,
    liberalPoliciesCount: 0,
    votes: null,
}

const actions = {
    [addPlayer]: (state, action) => {
        const { player } = action.payload
        const { playersDict } = state

        return {
            ...state,
            playersDict: { ...playersDict, [player.playerName]: player },
        }
    },
    [removePlayer]: (state, action) => {
        const { playerName } = action.payload
        const newPlayersDict = { ...state.playersDict }
        delete newPlayersDict[playerName]

        return {
            ...state,
            playersDict: newPlayersDict,
        }
    },
    [syncRoomData]: (state, action) => {
        const { maxPlayers, ownerName, playersDict, gamePhase } = action.payload

        return {
            ...state,
            maxPlayers,
            playersDict,
            gamePhase,
            ownerName,
        }
    },
    [changeGamePhase]: (state, action) => {
        const { gamePhase } = action.payload

        return {
            ...state,
            gamePhase,
        }
    },
    [chooseNewChancellor]: (state, action) => {
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
    [chooseNewPresident]: (state, action) => {
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
    [increasePolicyCount]: (state, action) => {
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
    [revealFacists]: (state, action) => {
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
    [registerVote]: (state, action) => {
        const { votes } = state
        const { playerName } = action.payload

        return {
            ...state,
            votes: { ...votes, [playerName]: '' },
        }
    },
    [revealVotes]: (state, action) => {
        const { newVotes } = action.payload
        return {
            ...state,
            votes: newVotes,
        }
    },
    [killPlayer]: (state, action) => {
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
