import { map, reject } from 'lodash'
import { invokeOnEvery } from '../utils/collectionsHelper'

import { SocketEvents, ChoiceModeContexts } from '../../Dictionary'
import { socket } from '../utils/SocketHandler'

import { store } from '../store'
import { toggleModal } from '../ducks/modalDuck'
import * as playersActions from '../ducks/playersDuck'
import * as roomActions from '../ducks/roomDuck'

export function startGame() {
    socket.emit(SocketEvents.START_GAME)
    store.dispatch(roomActions.resetTracker())
}

export function resumeGame() {
    socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
    store.dispatch(toggleModal({ value: false }))
}

// TODO
export function openInvitePlayersScreen() {

}

export function endGame() {
    socket.emit(SocketEvents.GameFinished)
}
