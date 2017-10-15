import { handleActions, createAction } from 'redux-actions'

// Actions
const SET_MODAL = 'modal/SET_MODAL'
const TOGGLE_MODAL = 'modal/TOGGLE_MODAL'

const setModal = createAction(SET_MODAL)
const toggleModal = createAction(TOGGLE_MODAL)

const initialState = {
    isVisible: false,
    title: '',
    overlayClosesModal: false,
    isCloseButtonShown: false,
    componentName: '',
    modalTmpData: {},
}

const actions = {
    [SET_MODAL]: (state, action) => {
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
    [TOGGLE_MODAL]: (state, action) => {
        const { value } = action.payload
        return {
            ...state,
            isVisible: value,
        }
    },
}

export { setModal, toggleModal }
export default handleActions(actions, initialState)
