import { handleActions, createAction } from 'redux-actions'
import { reject } from 'lodash'
import { MessagesTypes } from '../../Dictionary'

// Actions
const addNotification = createAction('info/ADD_NOTIFICATION')
const deleteNotification = createAction('info/DELETE_NOTIFICATION')

const initialState = {
    currentID: 0,
    notifications: [],
    statusNotification: null,
}

const actions = {
    [addNotification]: (state, action) => {
        const { notifications, currentID } = state
        const { type, message } = action.payload
        const newID = currentID + 1

        const newNotification = {
            id: newID,
            type,
            message,
        }
        console.log('Added new notif!', type, message)

        return {
            ...state,
            currentID: newID,
            ...(
                type === MessagesTypes.STATUS
                    ? { statusNotification: newNotification }
                    : {
                        notifications: [
                            ...notifications,
                            newNotification,
                        ],
                    }
            ),
        }
    },
    [deleteNotification]: (state, action) => {
        const { notifications } = state
        const id = action.payload
        const newNotifications = reject(notifications, ['id', id])
        return {
            ...state,
            notifications: newNotifications,
        }
    },
}

export { addNotification, deleteNotification }
export default handleActions(actions, initialState)
