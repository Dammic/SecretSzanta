import { handleActions, createAction } from 'redux-actions'
import { List, Record } from 'immutable'
import { reject } from 'lodash'

// Actions
const ADD_NOTIFICATION = 'info/ADD_NOTIFICATION'
const DELETE_NOTIFICATION = 'info/DELETE_NOTIFICATION'

const addNotification = createAction(ADD_NOTIFICATION)
const deleteNotification = createAction(DELETE_NOTIFICATION)

const initialState = {
    currentID: 0,
    notifications: [],
}

const actions = {
    [ADD_NOTIFICATION]: (state, action) => {
        const { notifications, currentID } = state
        const { type, message } = action.payload
        const newID = currentID + 1
        return {
            ...state,
            currentID: newID,
            notifications: [
                ...notifications,
                {
                    id: newID,
                    type,
                    message,
                },
            ],
        }
    },
    [DELETE_NOTIFICATION]: (state, action) => {
        const { notifications } = state
        const { id } = action.payload
        const newNotifications = reject(notifications, ['id', id])
        return {
            ...state,
            notifications: newNotifications,
        }
    },
}

export { addNotification, deleteNotification }
export default handleActions(actions, initialState)
