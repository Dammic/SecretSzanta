import { handleActions, createAction } from 'redux-actions'

// Actions
const setModal = createAction('modal/SET_MODAL')
const toggleModal = createAction('modal/TOGGLE_MODAL')

const initialState = {
    isVisible: false,
    title: '',
    overlayClosesModal: false,
    isCloseButtonShown: false,
    componentName: '',
    modalTmpData: {},
}

const actions = {
    [setModal]: (state, action) => {
        const { isVisible = true, title, overlayClosesModal = false, isCloseButtonShown = false, componentName, initialData } = action.payload
        return {
            isVisible,
            title,
            overlayClosesModal,
            isCloseButtonShown,
            componentName,
            modalTmpData: initialData,
        }
    },
    [toggleModal]: (state, action) => {
        const { value } = action.payload
        return {
            ...state,
            isVisible: value,
        }
    },
}

export { setModal, toggleModal }
export default handleActions(actions, initialState)
