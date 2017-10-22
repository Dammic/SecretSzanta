import { handleActions, createAction } from 'redux-actions'

// Actions
const setChoiceMode = createAction('players/SET_CHOICE_MODE')
const setChooserPlayer = createAction('players/SET_CHOOSER_PLAYER')
const hideChoiceMode = createAction('players/HIDE_CHOICE_MODE')

const initialState = {
    choiceMode: {
        isVisible: false,
        context: '',
        selectablePlayers: [],
        chooserPlayerName: '',
    },
}

const actions = {
    [setChoiceMode]: (state, action) => {
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
    },
    [setChooserPlayer]: (state, action) => {
        const { choiceMode } = state
        const { playerName } = action.payload

        return {
            ...state,
            choiceMode: {
                ...choiceMode,
                chooserPlayerName: playerName,
            },
        }
    },
    [hideChoiceMode]: state => ({
        ...state,
        choiceMode: initialState.choiceMode,
    }),
}

export { setChoiceMode, setChooserPlayer, hideChoiceMode }
export default handleActions(actions, initialState)
