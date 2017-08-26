// Actions
const SET_CHOICE_MODE = 'room/SET_CHOICE_MODE'
const HIDE_CHOICE_MODE = 'room/HIDE_CHOICE_MODE'

const initialState = {
    choiceMode: {
        isVisible: false,
        context: '',
        selectablePlayers: [],
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
