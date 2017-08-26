
// Actions
const SET_MODAL = 'modal/SET_MODAL'
const TOGGLE_MODAL = 'modal/TOGGLE_MODAL'


const initialState = {
    isVisible: false,
    title: '',
    overlayClosesModal: false,
    isCloseButtonShown: false,
    componentName: '',
    modalTmpData: {},
}

// Reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_MODAL: {
            const { isVisible = true, title, overlayClosesModal = false, isCloseButtonShown = false, componentName, initialData } = action.payload
            return {
                isVisible,
                title,
                overlayClosesModal,
                isCloseButtonShown,
                componentName,
                modalTmpData: initialData,
            }
        }
        case TOGGLE_MODAL: {
            const { value } = action.payload
            return {
                ...state,
                isVisible: value,
            }
        }

        default:
            return state
    }
}

export function setModal({ isVisible, title, overlayClosesModal, isCloseButtonShown, initialData, componentName }) {
    return {
        type: SET_MODAL,
        payload: {
            isVisible,
            title,
            overlayClosesModal,
            isCloseButtonShown,
            initialData,
            componentName,
        },
    }
}

export function toggleModal(value) {
    return {
        type: TOGGLE_MODAL,
        payload: {
            value,
        },
    }
}
