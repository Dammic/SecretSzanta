import { handleActions, createAction } from 'redux-actions'

// Actions
const SET_CHOICE_MODE = 'players/SET_CHOICE_MODE'
const SET_CHOOSER_PLAYER = 'players/SET_CHOOSER_PLAYER'
const HIDE_CHOICE_MODE = 'players/HIDE_CHOICE_MODE'

const setChoiceMode = createAction(SET_CHOICE_MODE)
const setChooserPlayer = createAction(SET_CHOOSER_PLAYER)
const hideChoiceMode = createAction(HIDE_CHOICE_MODE)

const initialState = {
    choiceMode: {
        isVisible: false,
        context: '',
        selectablePlayers: [],
        chooserPlayerName: '',
    },
}

const actions = {
    [SET_CHOICE_MODE]: (state, action) => {
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
    [SET_CHOOSER_PLAYER]: (state, action) => {
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
    [HIDE_CHOICE_MODE]: state => ({
        ...state,
        choiceMode: initialState.choiceMode,
    }),
}

export { setChoiceMode, setChooserPlayer, hideChoiceMode }
export default handleActions(actions, initialState)
