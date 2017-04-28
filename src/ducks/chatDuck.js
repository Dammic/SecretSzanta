'use strict'
import moment from 'moment'
import {CLIENT_SEND_MESSAGE, CLIENT_JOIN_ROOM, CLIENT_LEAVE_ROOM} from '../const/SocketEvents'

// Actions
const TEST = 'chat/TEST'

const initialState = {
    messages: [],
    scrollHeight: 0
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case CLIENT_JOIN_ROOM: {
            const {messages} = state
            const {timestamp, playerName, scrollHeight} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author: '',
                content: `${playerName} has joined the room!`
            }
            return {
                ...state,
                messages: [...messages, newMessage],
                scrollHeight
            }
        }
        case CLIENT_LEAVE_ROOM: {
            const {messages} = state
            const {timestamp, playerName, scrollHeight} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author: '',
                content: `${playerName} has left the room!`
            }
            return {
                ...state,
                messages: [...messages, newMessage],
                scrollHeight
            }
        }
        case CLIENT_SEND_MESSAGE: {
            const {messages} = state
            const {timestamp, content, author, scrollHeight} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author,
                content
            }
            return {
                ...state,
                messages: [...messages, newMessage],
                scrollHeight
            }
        }
        default:
            return state
    }
}

// Action Creators
export function someAction (aaa) {
    return {
        type: TEST,
        payload: {
            TESTVAR: aaa
        }
    }
}