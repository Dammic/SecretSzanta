import moment from 'moment'
import { handleActions, createAction } from 'redux-actions'

// Actions
const addMessage = createAction('chat/ADD_MESSAGE')

const initialState = {
    messages: [],
}

const actions = {
    [addMessage]: (state, action) => {
        const { messages } = state
        const { timestamp, content, author } = action.payload
        const newMessage = {
            time: moment.unix(timestamp).format('HH:mm'),
            content,
            author: author || '',
        }
        return {
            ...state,
            messages: [...messages, newMessage],
        }
    },
}

export { addMessage }
export default handleActions(actions, initialState)
