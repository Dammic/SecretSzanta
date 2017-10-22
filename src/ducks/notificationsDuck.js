import { handleActions, createAction } from 'redux-actions'
import { reject } from 'lodash'

// Actions
const addNotification = createAction('info/ADD_NOTIFICATION')
const deleteNotification = createAction('info/DELETE_NOTIFICATION')

const initialState = {
    currentID: 0,
    notifications: [],
}

const actions = {
    [addNotification]: (state, action) => {
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
    [deleteNotification]: (state, action) => {
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
