import { io } from '../../io'
import { SocketEvents } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'

export const emitToRoom = (room, eventType, data) => io.sockets.in(room).emit(eventType, { data })

export const emitToPlayer = (emit, eventType, data) => emit(eventType, { data })

export const emitMessage = (room, emit = null, { content, author = null }) => {
    const data = {
        content,
        author,
        timestamp: getCurrentTimestamp(),
    }

    if (emit) {
        emitToPlayer(emit, SocketEvents.CLIENT_SEND_MESSAGE, data)
    } else {
        emitToRoom(room, SocketEvents.CLIENT_SEND_MESSAGE, data)
    }
}

export const emitError = (emit, errorMessage) => {
    emit(SocketEvents.CLIENT_ERROR, { error: errorMessage })
}

export const emitGameNotification = (room, type, message) => {
    emitToRoom(room, SocketEvents.ClientGameNotification, { type, message })
}
