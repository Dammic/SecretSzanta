import { SocketEvents } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'
import { emitToRoom } from './generic'

// TODO: change to sync tracker position
export const emitIncreaseTrackerPosition = (room) => emitToRoom(
    room,
    SocketEvents.IncreaseTrackerPosition,
    { timestamp: getCurrentTimestamp() },
)

export const emitResetTracker = (room) => {
    emitToRoom(room, SocketEvents.ResetTracker, { timestamp: getCurrentTimestamp() })
}
