'use strict'
import IO from 'socket.io-client'

export let socket

export const initializeSocket = () => {
    socket = IO()
}