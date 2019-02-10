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
        const { type, message, values } = action.payload
        const newID = currentID + 1

        const newNotification = {
            id: newID,
            type,
            message,
        }

        return {
            ...state,
            currentID: newID,
            ...(
                type === MessagesTypes.STATUS
                    ? { statusNotification: {
                            ...newNotification,
                            values,
                        }
                    } : {
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
