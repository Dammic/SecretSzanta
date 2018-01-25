import { SocketEvents } from '../../Dictionary'
import { socket } from '../utils/SocketHandler'

export const startOrResumeGame = () => socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
