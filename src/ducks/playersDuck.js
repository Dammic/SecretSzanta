// Actions
const SET_CHOICE_MODE = 'players/SET_CHOICE_MODE'
const HIDE_CHOICE_MODE = 'players/HIDE_CHOICE_MODE'
const SET_CHOOSER_PLAYER = 'players/SET_CHOOSER_PLAYER'

const initialState = {
    choiceMode: {
        isVisible: false,
        context: '',
        selectablePlayers: [],
        chooserPlayerName: '',
    },
}

// Reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CHOICE_MODE: {
            const { choiceMode } = state
            const { isVisible, context, selectablePlayers } = action.payload

            return {
                ...state,
                choiceMode: {
                    ...choiceMode,
                    isVisible,
                    context,
                    selectablePlayers,
                },
            }
        }

        case SET_CHOOSER_PLAYER: {
            const { choiceMode } = state
            const { playerName } = action.payload

            return {
                ...state,
                choiceMode: {
                    ...choiceMode,
                    chooserPlayerName: playerName,
                },
            }
        }

        case HIDE_CHOICE_MODE: {
            return {
                ...state,
                choiceMode: initialState.choiceMode,
            }
        }

        default:
            return state
    }
}

export function setChoiceMode(isVisible, context, selectablePlayers) {
    return {
        type: SET_CHOICE_MODE,
        payload: {
            isVisible,
            context,
            selectablePlayers,
        },
    }
}

export function hideChoiceMode() {
    return {
        type: HIDE_CHOICE_MODE,
        payload: {},
    }
}

export function setChooserPlayer(playerName) {
    return {
        type: SET_CHOOSER_PLAYER,
        payload: { playerName },
    }

}
