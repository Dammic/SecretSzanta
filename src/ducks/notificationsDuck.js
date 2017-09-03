import { MessagesTypes } from '../../Dictionary.js'
import { reject } from 'lodash'

// Actions
const ADD_NOTIFICATION = 'info/ADD_NOTIFICATION'
const DELETE_NOTIFICATION = 'info/DELETE_NOTIFICATION'

const initialState = {
    currentID: 0,
    information: [],
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_NOTIFICATION: {
            const newID = state.currentID + 1
            return {
                ...state,
                currentID: newID,
                information: [
                    ...state.information,
                    {
                        ...action.payload,
                        id: newID,
                    },
                ],
            }
        }
        case DELETE_NOTIFICATION: {
            const newInformation = reject(state.information, ['id', action.payload.id])
            return {
                ...state,
                information: newInformation,
            }
        }
        default:
            return state
    }
}

// Action creators

export function addInformation(info) {
    return {
        type: ADD_NOTIFICATION,
        payload: {
            type: MessagesTypes.INFO_NOTIFICATION,
            message: info,
        },
    }
}

export function addError(error) {
    return {
        type: ADD_NOTIFICATION,
        payload: {
            type: MessagesTypes.ERROR_NOTIFICATION,
            message: error,
        },
    }
}

export function deleteInformation(id) {
    return {
        type: DELETE_NOTIFICATION,
        payload: {
            id,
        },
    }
}

