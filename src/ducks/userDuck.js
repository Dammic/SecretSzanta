// Actions
const SELECT_NAME = 'user/SELECT_NAME'
const JOIN_ROOM = 'user/JOIN_ROOM'
const TOGGLE_AFFILIATION_MENU = 'user/TOGGLE_AFFILIATION_MENU'

const initialState = {
    userName: '',
    roomName: '',
    isAffiliationHidden: false,
}

// Reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SELECT_NAME: {
            const { userName } = action.payload
            return {
                ...state,
                userName,
            }
        }
        case JOIN_ROOM: {
            const { roomName } = action.payload
            return {
                ...state,
                roomName,
            }
        }
        case TOGGLE_AFFILIATION_MENU: {
            const { isAffiliationHidden } = state
            return {
                ...state,
                isAffiliationHidden: !isAffiliationHidden,
            }
        }
        default:
            return state
    }
}

// Action Creators
export function selectName(userName) {
    return {
        type: SELECT_NAME,
        payload: {
            userName,
        },
    }
}

export function joinRoom(roomName) {
    return {
        type: JOIN_ROOM,
        payload: {
            roomName,
        },
    }
}

export function toggleAffiliationMenu() {
    return {
        type: TOGGLE_AFFILIATION_MENU,
    }
}
