import { io } from '../../io'

export const emitToRoom = (room, eventType, data) => io.sockets.in(room).emit(eventType, { data })

export const emitToPlayer = (emit, eventType, data) => emit(eventType, { data })
