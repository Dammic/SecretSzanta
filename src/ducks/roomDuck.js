import { handleActions, createAction } from 'redux-actions'
import { cloneDeep, forEach, find, isNil } from 'lodash'
import { PlayerRole } from '../../Dictionary'

// Actions
export const setRoomId = createAction('room/SET_ROOM_ID')
export const addPlayer = createAction('room/addPlayer')
export const removePlayer = createAction('room/REMOVE_PLAYER')
export const changeGamePhase = createAction('room/CHANGE_GAME_PHASE')
export const chooseNewChancellor = createAction('room/CHOOSE_NEW_CHANCELLOR')
export const chooseNewPresident = createAction('room/CHOOSE_NEW_PRESIDENT')
export const syncRoomData = createAction('room/SYNC_ROOM_DATA')
export const increasePolicyCount = createAction('room/INCREASE_POLICY_COUNT')
export const setPoliciesCount = createAction('room/SET_POLICY_COUNTS')
export const increaseTracker = createAction('room/INCREASE_TRACKER')
export const resetTracker = createAction('room/RESET_TRACKER')
export const revealFacists = createAction('room/REVEAL_FACISTS')
export const registerVote = createAction('room/REGISTER_VOTE')
export const resetVotes = createAction('room/RESET_VOTES')
export const revealVotes = createAction('room/REVEAL_VOTES')
export const killPlayer = createAction('room/KILL_PLAYER')
export const clearRoom = createAction('room/CLEAR_ROOM')
export const setWaitTime = createAction('room/SET_WAIT_TIME')
export const setVeto = createAction('room/SET_VETO')
export const setBoardType = createAction('room/SET_BOARD_TYPE')

const initialState = {
    roomId: null,
    maxPlayers: 0,
    ownerName: '',
    playersDict: {},
    gamePhase: '',
    potentialChancellorsChoices: [],
    facistPoliciesCount: 0,
    liberalPoliciesCount: 0,
    trackerPosition: 0,
    votes: null,
    waitTime: 0,
    isVetoUnlocked: false,
    boardType: null,
}

const actions = {
    [setRoomId]: (state, action) => {
        const { roomId } = action.payload

        return {
            ...state,
            roomId,
        }
    },
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
        const { maxPlayers, ownerName, trackerPosition, playersDict, gamePhase } = action.payload

        return {
            ...state,
            maxPlayers,
            trackerPosition,
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
        }
    },

    [increaseTracker]: (state, action) => {
        const position = state.trackerPosition
        return {
            ...state,
            trackerPosition: position + 1,
        }
    },
    [resetTracker]: (state, action) => {
        return {
            ...state,
            trackerPosition: 0,
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
    [setPoliciesCount]: (state, { payload: { facist, liberal } }) => ({
        ...state,
        facistPoliciesCount: (isNil(facist) ? state.facistPoliciesCount : facist),
        liberalPoliciesCount: (isNil(liberal) ? state.liberalPoliciesCount : liberal),
    }),
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
    [resetVotes]: state => {
        return {
            ...state,
            votes: null,
        }
    },
    [clearRoom]: () => initialState,
    [setWaitTime]: (state, { payload: { waitTime } }) => ({
        ...state,
        waitTime,
    }),
    [setVeto]: (state, { payload: { value } }) => ({
        ...state,
        isVetoUnlocked: value,
    }),
    [setBoardType]: (state, { payload: { newBoardType } }) => ({
        ...state,
        boardType: newBoardType,
    }),
}

export default handleActions(actions, initialState)
