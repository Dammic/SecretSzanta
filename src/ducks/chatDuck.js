'use strict'
import moment from 'moment'
import {SocketEvents} from '../../Dictionary'

// Actions
const ADD_MESSAGE = 'chat/ADD_MESSAGE'

const initialState = {
    messages: []
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case ADD_MESSAGE: {
            const {messages} = state
            const {message} = action.payload
            return {
                ...state,
                messages: [...messages, message]
            }
        }
        default:
            return state
    }
}

// Action Creators

/**
 * Function that adds a message to messages list
 * @param {Number} timestamp - server timestamp of the message
 * @param {String} content - message to be added
 * @param {String} [author = null] - name of the author. Not passed for server messages
 */
export function addMessage(timestamp, content, author = null) {
    const newMessage = {
        time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
        content,
        author: author || ''
    }
    return {
        type: ADD_MESSAGE,
        payload: {
            message: newMessage
        }
    }
}