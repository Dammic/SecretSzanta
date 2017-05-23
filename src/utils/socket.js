'use strict'
import IO from 'socket.io-client'
import {SocketEvents} from '../../Dictionary'

export let socket

export const initializeSocket = () => {
    socket = IO()
    return (dispatch) => {
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (data) => dispatch({type: SocketEvents.CLIENT_GET_ROOM_DATA, payload: {...data}}))
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, (data) => dispatch({type: SocketEvents.CLIENT_JOIN_ROOM, payload: {...data}}))
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (data) => dispatch({type: SocketEvents.CLIENT_LEAVE_ROOM, payload: {...data}}))
        socket.on(SocketEvents.VOTING_PHASE_START, (data) => dispatch({type: SocketEvents.VOTING_PHASE_START, payload: {...data}}))
        socket.on(SocketEvents.START_GAME, (data) => dispatch({type: SocketEvents.START_GAME, payload: {...data}}))
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (data) => dispatch({type: SocketEvents.VOTING_PHASE_REVEAL, payload: {...data}}))
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, (data) => dispatch({type: SocketEvents.CHANCELLOR_CHOICE_PHASE, payload: {...data}}))
    }
}