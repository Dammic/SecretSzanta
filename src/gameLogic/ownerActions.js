import { invokeOnEvery } from '../utils/collectionsHelper'

import { SocketEvents, ChoiceModeContexts } from '../../Dictionary'
import { socket } from '../utils/SocketHandler'

import { store } from '../AppClient'
import { toggleModal } from '../ducks/modalDuck'
import * as playersActions from '../ducks/playersDuck'
import * as roomActions from '../ducks/roomDuck'

export function startGame(userName) {
    socket.emit(SocketEvents.START_GAME, { playerName: userName })
    store.dispatch(roomActions.resetTracker())
}

export function resumeGame() {
    socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
    store.dispatch(toggleModal({ value: false }))
}

export function startVoting() {
    socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
}

export function openInvitePlayersScreen() {

}

// TODO: should take needed data by it self from tree, not from arguments
export function kickPlayer(userName, playersWithoutMe) {
    invokeOnEvery([
        playersActions.setChooserPlayer({ playerName: userName }),
        playersActions.setChoiceMode({
            context: ChoiceModeContexts.KickChoice,
            selectablePlayers: playersWithoutMe,
        }),
    ], store.dispatch)
}

export function banPlayer(userName, playersWithoutMe) {
    invokeOnEvery([
        playersActions.setChooserPlayer({ playerName: userName }),
        playersActions.setChoiceMode({
            context: ChoiceModeContexts.BanChoice,
            selectablePlayers: playersWithoutMe,
        }),
    ], store.dispatch)
}

export function endGame() {

}
