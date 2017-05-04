'use strict'
import moment from 'moment'
import {SocketEvents} from '../../Dictionary'

// Actions
const SCROLL_CHAT = 'chat/SCROLL_CHAT'

const initialState = {
    messages: [],
    scrollHeight: 0
}

// Reducer
export default function reducer (state = initialState, action = {}) {
    switch (action.type) {
        case SocketEvents.CLIENT_JOIN_ROOM: {
            const {messages} = state
            const {timestamp, playerName} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author: '',
                content: `${playerName} has joined the room!`
            }
            return {
                ...state,
                messages: [...messages, newMessage]
            }
        }
        case SocketEvents.CLIENT_LEAVE_ROOM: {
            const {messages} = state
            const {timestamp, playerName} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author: '',
                content: `${playerName} has left the room!`
            }
            return {
                ...state,
                messages: [...messages, newMessage]
            }
        }
        case SocketEvents.CLIENT_SEND_MESSAGE: {
            const {messages} = state
            const {timestamp, content, author} = action.payload
            const newMessage = {
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                author,
                content
            }
            return {
                ...state,
                messages: [...messages, newMessage]
            }
        }
        case SCROLL_CHAT: {
            const {scrollHeight} = action.payload
            return {
                ...state,
                scrollHeight
            }
        }
        default:
            return state
    }
}

// Action Creators
export function scrollChat (scrollHeight) {
    return {
        type: SCROLL_CHAT,
        payload: {
            scrollHeight
        }
    }
}